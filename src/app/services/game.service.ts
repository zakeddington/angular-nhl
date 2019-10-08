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
  private gamePlayerData = new Subject<any>();
  private gameContent = new Subject<any>();
  private noData = {
    showNoResults: true,
  };

  constructor(private apiService: ApiService) { }

  subscribeToGameData(): Observable<any> {
    return this.gameData.asObservable();
  }

  subscribeToGamePeriodData(): Observable<any> {
    return this.gamePeriodData.asObservable();
  }

  subscribeToGamePlayerData(): Observable<any> {
    return this.gamePlayerData.asObservable();
  }

  subscribeToGameContent(): Observable<any> {
    return this.gameContent.asObservable();
  }

  getGameDetail(gameId) {
    this.apiService.getGameDetail(gameId)
      .subscribe(
        (data) => this.processGameData(data),
        (error) => {
          console.error('getGameDetail error', error);
          this.gameData.next(this.noData);
          this.gamePeriodData.next(this.noData);
          this.gamePlayerData.next(this.noData);
        }
      );
  }

  async processGameData(data) {
    // console.log('processGameData', data);
    try {
      await this.getGameData(data);
    } catch (error) {
      console.error('getGameData error', error);
      this.gameData.next(this.noData);
    }

    try {
      await this.getPeriodSummary(data);
    } catch (error) {
      console.error('getPeriodSummary error', error);
      this.gamePeriodData.next(this.noData);
    }

    try {
      await this.getPlayerStats(data);
    } catch (error) {
      console.error('getPlayerStats error', error);
      this.gamePlayerData.next(this.noData);
    }
  }

  async getGameData(data) {
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
      showNoResults: false,
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

    // console.log('getGameData', results);

    this.gameData.next(results);
  }

  getPlayerStats(data) {
    const awayPlayers = data.liveData.boxscore.teams.away.players;
    const homePlayers = data.liveData.boxscore.teams.home.players;
    const awayStats = this.createPlayerData(awayPlayers);
    const homeStats = this.createPlayerData(homePlayers);
    const gameStatus = UTILS.getGameStatus(data.liveData.linescore);
    const isPreview = !gameStatus.length;
    const showNoResults = (!awayStats && !homeStats);
    const results = {
      showNoResults,
      isPreview,
      teams: [
        {
          id: data.gameData.teams.away.id,
          name: data.gameData.teams.away.name,
          stats: awayStats,
        },
        {
          id: data.gameData.teams.home.id,
          name: data.gameData.teams.home.name,
          stats: homeStats,
        }
      ]
    };

    // console.log('getPlayerStats', results);

    this.gamePlayerData.next(results);
  }

  createPlayerData(players) {
    const stats = [];
    const forwards = [];
    const defense = [];
    const goalies = [];

    Object.keys(players).forEach((key) => {
      const player = players[key];
      if (Object.keys(player.stats).length) {
        const playerData = {
          number: player.jerseyNumber,
          name: player.person.fullName,
          pos: player.position.abbreviation,
        };

        switch (player.position.code) {
          case 'D':
            defense.push(
              Object.assign({
                stats: this.getStatPercent(player.stats.skaterStats, 'faceOffWins', 'faceoffTaken', 'faceOffPercent'),
              }, playerData)
            );
            break;
          case 'G':
            goalies.push(
              Object.assign({
                stats: this.getSavePercent(player.stats.goalieStats, 'saves', 'shots', 'savePercent'),
              }, playerData)
            );
            break;
          default:
            forwards.push(
              Object.assign({
                stats: this.getStatPercent(player.stats.skaterStats, 'faceOffWins', 'faceoffTaken', 'faceOffPercent'),
              }, playerData)
            );
            break;
        }
      }
    });

    if (!forwards.length && !defense.length && !goalies.length) {
      return null;
    }

    forwards.sort((a, b) => a.number - b.number);
    defense.sort((a, b) => a.number - b.number);
    goalies.sort((a, b) => a.number - b.number);

    stats.push({
      position: 'Forwards',
      players: forwards,
    });

    stats.push({
      position: 'Defense',
      players: defense,
    });

    stats.push({
      position: 'Goalies',
      players: goalies,
    });

    return stats;
  }

  getStatPercent(playerData, winPropName, totalPropName, newProp) {
    const data = playerData;
    const wins = data[winPropName];
    const total = data[totalPropName];
    data[newProp] = '-';

    if (total) {
      data[newProp] = Math.round((wins / total) * 100);
    }

    return data;
  }

  getSavePercent(playerData, winPropName, totalPropName, newProp) {
    const data = playerData;
    const wins = data[winPropName];
    const total = data[totalPropName];
    data[newProp] = '-';

    if (total) {
      data[newProp] = Math.round((wins / total) * 1000) / 1000;
    }

    return data;
  }

  getPeriodSummary(data) {
    const periods = data.liveData.linescore.periods;
    const scoringIds = data.liveData.plays.scoringPlays;
    const penaltyIds = data.liveData.plays.penaltyPlays;
    const allPlays = data.liveData.plays.allPlays;
    const hasShootout = data.liveData.linescore.hasShootout;
    const teamAwayId = data.gameData.teams.away.id;
    const teamHomeId = data.gameData.teams.home.id;
    const results = {
      showNoResults: false,
      periodPlays: [],
    };

    periods.forEach((period) => {
      const periodName = period.ordinalNum === 'OT' ? 'Overtime' : `${period.ordinalNum} Period`;

      results.periodPlays.push({
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

      // console.log('curPlay', curPlay);

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

        results.periodPlays[curPeriodIndex].goals.push(playDetail);
      }
    });

    penaltyIds.forEach((id) => {
      const curPlay = allPlays[id];
      const curPeriodIndex = curPlay.about.period - 1;
      const penaltyTeamId = curPlay.team.id;
      let curPenaltyOn = {};

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

        results.periodPlays[curPeriodIndex].penalties.push(playDetail);
      }
    });

    if (hasShootout) {
      const shootoutPlays = this.getShootoutSummary(data);
      results.periodPlays.push({
        periodName: 'Shootout',
        goals: [],
        penalties: [],
        shootoutPlays,
      });
    }

    // console.log('getPeriodSummary', results);

    if (results.periodPlays.length) {
      this.gamePeriodData.next(results.periodPlays);
    } else {
      this.gamePeriodData.next(this.noData);
    }
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
        async (data) => {
          try {
            await this.processGameContent(data);
          } catch (error) {
            console.error('processGameContent error', error);
            this.gameContent.next(this.noData);
          }
        },
        (error) => {
          console.error('getGameContent error', error);
          this.gameContent.next(this.noData);
        }
      );
  }

  async processGameContent(data) {
    // console.log('processGameContent data', data);
    const previewData = data.editorial.preview.items[0];
    const recapData = data.editorial.recap.items[0];
    const mediaData = data.media.epg;
    const highlights = data.highlights.gameCenter.items;
    let title = '';
    let desc = '';
    let poster = '';
    let posterAltText = '';
    const videos = [];

    if (previewData) {
      title = previewData.headline;
      desc = previewData.seoDescription;
      poster = previewData.media.image.cuts['1284x722'].src;
      posterAltText = previewData.media.image.altText;
    }

    if (recapData) {
      title = recapData.headline;
      desc = recapData.seoDescription;
    }

    if (mediaData) {
      mediaData.forEach((item) => {
        const isRecapVideo = item.title === 'Recap';
        const isCondensedGame = item.title === 'Extended Highlights';

        if (isRecapVideo || isCondensedGame) {
          if (item.items.length) {
            const curItem = this.createVideoData(item.items[0]);

            if (isRecapVideo) {
              curItem.title = 'Game Recap';
              videos.splice(0, 0, curItem);
            } else {
              curItem.title = 'Condensed Game';
              videos.push(curItem);
            }
          }
        }
      });
    }

    if (highlights) {
      highlights.forEach((item) => {
        const curItem = this.createVideoData(item);
        videos.push(curItem);
      });
    }

    const results = {
      showNoResults: false,
      title,
      desc,
      poster,
      posterAltText,
      videos,
    };

    // console.log('processGameContent', results);

    this.gameContent.next(results);
  }

  createVideoData(data) {
    // console.log(data);
    const title = data.title;
    const playbacks = data.playbacks;
    const duration = data.duration;
    const thumb = data.image.cuts['640x360'].src;
    const poster = data.image.cuts['1136x640'].src;
    const posterAltText = data.image.altText;
    let url = '';

    playbacks.forEach((video) => {
      if (video.name === 'FLASH_1800K_960X540') {
        url = video.url;
      }
    });

    return {
      title,
      duration,
      url,
      poster,
      thumb,
      posterAltText,
      showVideoPlayer: false,
    };
  }
}
