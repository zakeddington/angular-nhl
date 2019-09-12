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

  constructor(private apiService: ApiService) { }

  subscribeToGameService(): Observable<any> {
    return this.gameData.asObservable();
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

    console.log('GameDetailService results', results);

    this.gameData.next(results);
  }

  // async getGameDetail(gameId) {
  //   const data = await API.getGame(gameId);
  //   const periodGoals = _.get(data, 'liveData.linescore.periods');
  //   const shootoutGoals = _.get(data, 'liveData.linescore.shootoutInfo');
  //   const boxscoreTeams = _.get(data, 'liveData.boxscore.teams');
  //   const stars = _.get(data, 'liveData.decisions');
  //
  //   let date = new Date(data.gameData.datetime.dateTime);
  //   let curDate = date.toLocaleDateString(CONSTANTS.lang, CONSTANTS.dateOptions);
  //   let startTime = date.toLocaleTimeString(CONSTANTS.lang, CONSTANTS.timeOptions);
  //   let awayScore = data.liveData.linescore.teams.away.goals;
  //   let homeScore = data.liveData.linescore.teams.home.goals;
  //   let periods = UTILS.getPeriodStats(periodGoals, awayScore, homeScore, shootoutGoals);
  //   let gameStatus = UTILS.getGameStatus(data.liveData.linescore);
  //   let curStars;
  //   let curStatus;
  //   let isPreview = true;
  //
  //   if (gameStatus.length) {
  //     curStatus = gameStatus;
  //     isPreview = false;
  //   } else {
  //     curStatus = startTime;
  //   }
  //
  //   if (Object.keys(stars).length) {
  //     let firstStar = UTILS.getStarStats(stars.firstStar, boxscoreTeams);
  //     let secondStar = UTILS.getStarStats(stars.secondStar, boxscoreTeams);
  //     let thirdStar = UTILS.getStarStats(stars.thirdStar, boxscoreTeams);
  //
  //     curStars = [firstStar, secondStar, thirdStar];
  //   }
  //
  //   let results = {
  //     isPreview: isPreview,
  //     date: curDate,
  //     gameStatus: curStatus,
  //     periodGoals: periods,
  //     teams: {
  //       away: {
  //         id: data.gameData.teams.away.id,
  //         city: data.gameData.teams.away.locationName,
  //         name: data.gameData.teams.away.teamName,
  //         score: awayScore,
  //       },
  //       home: {
  //         id: data.gameData.teams.home.id,
  //         city: data.gameData.teams.home.locationName,
  //         name: data.gameData.teams.home.teamName,
  //         score: homeScore,
  //       }
  //     },
  //     stars: curStars,
  //     boxscoreTeams: boxscoreTeams,
  //   }
  //
  //   // console.log('GameDetailService results', results);
  //
  //   return results;
  // }
}
