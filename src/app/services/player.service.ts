import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ApiService} from './api.service';
import * as moment from 'moment';
import {CONSTANTS} from '../config/Constants';
// import { UTILS } from './Utils';
// import { CONSTANTS } from '../config/Constants';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playerData = new Subject<any>();
  private noData = {
    showNoResults: true,
  };

  constructor(private apiService: ApiService) { }

  subscribeToPlayerData(): Observable<any> {
    return this.playerData.asObservable();
  }

  getPlayerData(playerId) {
    this.apiService.getPlayerData(playerId)
      .subscribe(
        async (data) => {
          try {
            await this.processPlayerData(data);
          } catch (error) {
            console.error('processPlayerData error', error);
            this.playerData.next(this.noData);
          }
        },
        (error) => {
          console.error('getGameContent error', error);
          this.playerData.next(this.noData);
        }
      );
  }

  async processPlayerData(data) {
    // console.log('processPlayerData', data);
    const player = data.people[0];
    const birthDate = moment(player.birthDate).format(CONSTANTS.momentOptions.birthFormat);
    const birthCity = player.birthCity;
    const birthState = player.birthStateProvince;
    const headshot = `${CONSTANTS.imgUrl.player.base}${CONSTANTS.imgUrl.player.headshot}${player.id}${CONSTANTS.imgUrl.player.ext}`;
    const hero = `${CONSTANTS.imgUrl.player.base}${CONSTANTS.imgUrl.player.hero}${player.id}${CONSTANTS.imgUrl.player.ext}`;
    const arena = `${CONSTANTS.imgUrl.player.base}${CONSTANTS.imgUrl.player.arena}${player.currentTeam.id}${CONSTANTS.imgUrl.player.ext}`;
    const validateHeroImg = new Image();
    let birthPlace = player.birthCountry;

    if (birthState) {
      birthPlace = `${birthState}, ${birthPlace}`;
    }

    if (birthCity) {
      birthPlace = `${birthCity}, ${birthPlace}`;
    }

    let seasonStats = [];
    let seasonStatsTotal = {};
    let playoffStats = [];
    let playoffStatsTotal = {};

    player.stats.map((stats) => {
      switch (stats.type.displayName) {
        case 'yearByYear':
          seasonStats = this.createYearStats(stats.splits);
          return;
        case 'careerRegularSeason':
          seasonStatsTotal = this.createTotalStats(stats.splits);
          return;
        case 'yearByYearPlayoffs':
          playoffStats = this.createYearStats(stats.splits);
          return;
        case 'careerPlayoffs':
          playoffStatsTotal = this.createTotalStats(stats.splits);
          return;
        default:
          return;
      }
    });

    if (seasonStatsTotal) {
      seasonStats.push(seasonStatsTotal);
    }

    if (playoffStatsTotal) {
      playoffStats.push(playoffStatsTotal);
    }

    const results = {
      showNoResults: false,
      name: player.fullName,
      height: player.height,
      weight: player.weight,
      birthPlace,
      birthDate,
      number: player.primaryNumber,
      pos: player.primaryPosition.abbreviation,
      age: player.currentAge,
      shoots: player.shootsCatches,
      headshot,
      hero,
      seasonStats,
      playoffStats,
    };

    validateHeroImg.src = hero;
    validateHeroImg.onerror = () => {
      results.hero = arena;
      this.playerData.next(results);
    };

    validateHeroImg.onload = () => {
      this.playerData.next(results);
    };
  }

  createYearStats(data) {
    const stats = [];

    data.map((item) => {
      if (item.league.id === 133) {
        let season = item.season;
        season = season.substring(0, 4) + '-' + season.substring(4);

        const results = {
          season,
          team: {
            abbreviation: item.team.abbreviation,
            id: item.team.id,
          },
          stats: item.stat,
        };

        stats.push(results);
      }
    });

    return stats;
  }

  createTotalStats(data) {
    if (data.length) {
      data[0].stat.goalAgainstAverage = (Math.round(data[0].stat.goalAgainstAverage * 100) / 100).toFixed(2);
      data[0].stat.savePercentage = (Math.round(data[0].stat.savePercentage * 1000) / 1000).toFixed(3);
      const stats = data[0].stat;

      return {
        season: 'Total',
        team: {
          abbreviation: '',
          id: '',
        },
        stats,
      };
    }

    return null;
  }
}
