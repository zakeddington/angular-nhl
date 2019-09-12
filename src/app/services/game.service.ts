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
  private gameContent = new Subject<any>();

  constructor(private apiService: ApiService) { }

  subscribeToGameData(): Observable<any> {
    return this.gameData.asObservable();
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
