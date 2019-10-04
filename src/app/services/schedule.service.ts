import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { UTILS } from './Utils';
import { CONSTANTS } from '../config/Constants';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private scheduleData = new Subject<any>();
  private noData = {
    showNoResults: true,
  };

  constructor(private apiService: ApiService) { }

  subscribeToScheduleService(): Observable<any> {
    return this.scheduleData.asObservable();
  }

  getScheduleGames(dateFrom, dateTo) {
    const params = [
      'schedule.linescore'
    ];
    this.apiService.getSchedule(dateFrom, dateTo, params)
      .subscribe(
        async (data) => {
          try {
            await this.processScheduleData(data);
          } catch (error) {
            console.error('processScheduleData error', error);
            this.scheduleData.next(this.noData);
          }
        },
        (error) => {
          console.error('getSchedule error', error);
          this.scheduleData.next(this.noData);
        }
      );
  }

  async processScheduleData(data) {
    // console.log('processScheduleData', data);
    const { dates } = data;
    const results = {
      showNoResults: false,
      schedule: [],
    };

    dates.forEach((date) => {
      const curDate = new Date(date.date.replace(/-/g, '/'));

      const curResults = {
        date: curDate.toLocaleDateString(CONSTANTS.lang, CONSTANTS.dateOptions),
        games: []
      };

      date.games.forEach((game) => {
        const startTime = new Date(game.gameDate).toLocaleTimeString(CONSTANTS.lang, CONSTANTS.timeOptions);
        const gameStatus = UTILS.getGameStatus(game.linescore);
        const awayOTL = game.teams.away.leagueRecord.ot ? `-${game.teams.away.leagueRecord.ot}` : '';
        const homeOTL = game.teams.home.leagueRecord.ot ? `-${game.teams.home.leagueRecord.ot}` : '';
        let curStatus = '';
        let classGameStatus = '';
        let awayScore = '';
        let homeScore = '';

        if (gameStatus.length) {
          curStatus = gameStatus;
          awayScore = game.teams.away.score;
          homeScore = game.teams.home.score;
        } else {
          curStatus = startTime;
        }

        if (curStatus.includes('Final')) {
          if (game.teams.home.score > game.teams.away.score) {
            classGameStatus = 'is-home-winner';
          } else {
            classGameStatus = 'is-away-winner';
          }
        } else if (curStatus === 'Preview') {
          classGameStatus = 'is-preview';
        }

        const gameDetail = {
          id: game.gamePk,
          gameStatus: curStatus,
          gameStatusClass: classGameStatus,
          teams: {
            away: {
              id: game.teams.away.team.id,
              name: game.teams.away.team.name,
              score: awayScore,
              record: `${game.teams.away.leagueRecord.wins}-${game.teams.away.leagueRecord.losses}${awayOTL}`,
            },
            home: {
              id: game.teams.home.team.id,
              name: game.teams.home.team.name,
              score: homeScore,
              record: `${game.teams.home.leagueRecord.wins}-${game.teams.home.leagueRecord.losses}${homeOTL}`,
            }
          }
        };

        curResults.games.push(gameDetail);
      });

      results.schedule.push(curResults);
    });

    // console.log('ScheduleService results', results);

    this.scheduleData.next(results);
  }
}
