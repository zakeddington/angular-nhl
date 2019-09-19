import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { UTILS } from './Utils';
import { CONSTANTS } from '../config/Constants';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameData = new Subject<any>();
  private gamePeriodData = new Subject<any>();
  private gameContent = new Subject<any>();

  constructor(private apiService: ApiService) { }

  subscribeToGameData(): Observable<any> {
    return this.gameData.asObservable();
  }

  subscribeToGamePeriodData(): Observable<any> {
    return this.gamePeriodData.asObservable();
  }

  subscribeToGameContent(): Observable<any> {
    return this.gameContent.asObservable();
  }

  getGameDetail(gameId) {
    this.apiService.getGameDetail(gameId)
      .subscribe(
        (data) => { this.processGameData(data); },
        (error) => console.error('getGameDetail error', error)
      );
  }

  processGameData(data) {
    this.getGameData(data);
    this.getPeriodSummary(data);
  }

  getGameData(data) {
    // console.log('processGameData', data);
    const periodGoals = data.liveData.linescore.periods;
    const shootoutGoals = data.liveData.linescore.shootoutInfo;
    const boxscoreTeams = data.liveData.boxscore.teams;
    const stars = data.liveData.decisions;

    const date = new Date(data.gameData.datetime.dateTime);
    const curDate = date.toLocaleDateString(CONSTANTS.lang, CONSTANTS.dateOptions);
    const startTime = date.toLocaleTimeString(CONSTANTS.lang, CONSTANTS.timeOptions);
    const awayScore = data.liveData.linescore.teams.away.goals;
    const homeScore = data.liveData.linescore.teams.home.goals;
    const periods = UTILS.getPeriodStats(periodGoals, awayScore, homeScore, shootoutGoals);
    const gameStatus = UTILS.getGameStatus(data.liveData.linescore);
    let curStars;
    let curStatus;
    let isPreview = true;

    if (gameStatus.length) {
      curStatus = gameStatus;
      isPreview = false;
    } else {
      curStatus = startTime;
    }

    if (Object.keys(stars).length) {
      const firstStar = UTILS.getStarStats(stars.firstStar, boxscoreTeams);
      const secondStar = UTILS.getStarStats(stars.secondStar, boxscoreTeams);
      const thirdStar = UTILS.getStarStats(stars.thirdStar, boxscoreTeams);

      curStars = [firstStar, secondStar, thirdStar];
    }

    const results = {
      isPreview,
      date: curDate,
      gameStatus: curStatus,
      periodGoals: periods,
      teams: {
        away: {
          id: data.gameData.teams.away.id,
          city: data.gameData.teams.away.locationName,
          name: data.gameData.teams.away.teamName,
          score: awayScore,
        },
        home: {
          id: data.gameData.teams.home.id,
          city: data.gameData.teams.home.locationName,
          name: data.gameData.teams.home.teamName,
          score: homeScore,
        }
      },
      stars: curStars,
      boxscoreTeams,
    };

    console.log('getGameData', results);

    this.gameData.next(results);
  }

  getPeriodSummary(data) {
    const periods = data.liveData.linescore.periods;
    const scoringIds = data.liveData.plays.scoringPlays;
    const penaltyIds = data.liveData.plays.penaltyPlays;
    const allPlays = data.liveData.plays.allPlays;
    const hasShootout = data.liveData.linescore.hasShootout;
    const teamAwayId = data.gameData.teams.away.id;
    const teamHomeId = data.gameData.teams.home.id;

    const periodPlays = [];

    periods.forEach((period) => {
      const periodName = period.ordinalNum === 'OT' ? 'Overtime' : `${period.ordinalNum} Period`;

      periodPlays.push({
        periodName,
        goals: [],
        penalties: [],
        shootoutPlays: [],
      });
    });

    scoringIds.forEach((id) => {
      const curPlay = allPlays[id];
      const curPeriodIndex = curPlay.about.period - 1;
      const scoringTeamId = curPlay.team.id;
      let curScorer = {};
      const curAssists = [];

      if (curPeriodIndex < periods.length) {
        curPlay.players.forEach((player) => {
          if (player.playerType === 'Scorer') {
            curScorer = {
              name: player.player.fullName,
              total: player.seasonTotal,
              desc: curPlay.result.secondaryType,
              photo: `${CONSTANTS.imgUrl.player.base}${player.player.id}${CONSTANTS.imgUrl.player.ext}`,
            };
          }

          if (player.playerType === 'Assist') {
            curAssists.push({
              name: player.player.fullName,
              total: player.seasonTotal,
            });
          }
        });

        const playDetail = {
          time: curPlay.about.periodTime,
          isEmptyNet: curPlay.result.emptyNet,
          goalType: curPlay.result.strength.code,
          teamId: scoringTeamId,
          score: {
            away: {
              name: data.gameData.teams.away.triCode,
              goals: curPlay.about.goals.away,
              isScoringTeam: scoringTeamId === teamAwayId,
            },
            home: {
              name: data.gameData.teams.home.triCode,
              goals: curPlay.about.goals.home,
              isScoringTeam: scoringTeamId === teamHomeId,
            },
          },
          scorer: curScorer,
          assists: curAssists
        };

        periodPlays[curPeriodIndex].goals.push(playDetail);
      }
    });

    penaltyIds.forEach((id) => {
      const curPlay = allPlays[id];
      const curPeriodIndex = curPlay.about.period - 1;
      const penaltyTeamId = curPlay.team.id;
      let curPenaltyOn;

      if (curPeriodIndex < periods.length) {
        curPlay.players.forEach((player) => {
          if (player.playerType === 'PenaltyOn') {
            curPenaltyOn = {
              name: player.player.fullName,
              photo: `${CONSTANTS.imgUrl.player.base}${player.player.id}${CONSTANTS.imgUrl.player.ext}`,
            };
          }
        });

        const playDetail = {
          time: curPlay.about.periodTime,
          teamId: penaltyTeamId,
          penaltyOn: curPenaltyOn,
          penaltyType: curPlay.result.secondaryType,
          penaltyMin: curPlay.result.penaltyMinutes,
        };

        periodPlays[curPeriodIndex].penalties.push(playDetail);
      }
    });

    if (hasShootout) {
      const shootoutPlays = this.getShootoutSummary(data);
      periodPlays.push({
        periodName: 'Shootout',
        goals: [],
        penalties: [],
        shootoutPlays
      });
    }

    console.log('periodPlays', periodPlays);
    this.gamePeriodData.next(periodPlays);
  }

  getShootoutSummary(data) {
    const playsByPeriod = data.liveData.plays.playsByPeriod;
    const playIds = playsByPeriod[4].plays;
    const allPlays = data.liveData.plays.allPlays;

    const shootoutPlays = [];

    playIds.forEach((id) => {
      const curPlay = allPlays[id];
      let curShooter;

      if (curPlay.players) {
        const shootingTeamId = curPlay.team.id;
        let isGoal = false;
        let shotResult = '';

        switch (curPlay.result.event) {
          case 'Goal':
            isGoal = true;
            shotResult = 'Goal';
            break;
          case 'Shot':
            shotResult = 'Save';
            break;
          case 'Missed Shot':
            shotResult = 'Miss';
            break;
          default:
            break;
        }

        curPlay.players.forEach((player) => {
          if (player.playerType === 'Scorer' || player.playerType === 'Shooter') {
            curShooter = {
              name: player.player.fullName,
              desc: curPlay.result.secondaryType,
              photo: `${CONSTANTS.imgUrl.player.base}${player.player.id}${CONSTANTS.imgUrl.player.ext}`,
            };
          }
        });

        const playDetail = {
          shooter: curShooter,
          isGoal,
          shotResult,
          teamId: shootingTeamId,
        };

        shootoutPlays.push(playDetail);
      }
    });

    return shootoutPlays;
  }

  getGameContent(gameId) {
    this.apiService.getGameContent(gameId)
      .subscribe(
        (data) => { this.processGameContent(data); },
        (error) => console.error('getGameContent error', error)
      );
  }

  processGameContent(data) {
    // console.log('processGameContent data', data);
    const previewData = data.editorial.preview.items[0];
    const recapData = data.editorial.recap.items[0];
    const mediaData = data.media.epg;

    let isRecap = false;
    let title = '';
    let desc = '';
    let poster = '';
    let posterAltText = '';
    let recapVideo = '';
    let recapPoster = '';

    if (previewData) {
      title = previewData.headline;
      desc = previewData.seoDescription;
      poster = previewData.media.image.cuts['1284x722'].src;
      posterAltText = previewData.media.image.altText;
    }

    if (recapData) {
      isRecap = true;
      title = recapData.headline;
      desc = recapData.seoDescription;

      mediaData.forEach((item) => {
        if (item.title === 'Recap') {
          const videos = item.items[0].playbacks;
          recapPoster = item.items[0].image.cuts['1136x640'].src;

          videos.forEach((video) => {
            if (video.name === 'FLASH_1800K_960X540') {
              recapVideo = video.url;
            }
          });
        }
      });
    }

    const results = {
      isRecap,
      title,
      desc,
      poster,
      posterAltText,
      recapVideo,
      recapPoster,
    };

    // console.log('getGameContent', results);

    this.gameContent.next(results);
  }
}