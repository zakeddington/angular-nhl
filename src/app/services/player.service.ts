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
    console.log('processPlayerData', data);
    const player = data.people[0];
    const birthDate = moment(player.birthDate).format(CONSTANTS.momentOptions.birthFormat);
    const birthCity = player.birthCity;
    const birthState = player.birthStateProvince;
    const headshot = `${CONSTANTS.imgUrl.player.base}${CONSTANTS.imgUrl.player.headshot}${player.id}${CONSTANTS.imgUrl.player.ext}`;
    const hero = `${CONSTANTS.imgUrl.player.base}${CONSTANTS.imgUrl.player.hero}${player.id}${CONSTANTS.imgUrl.player.ext}`;
    let birthPlace = player.birthCountry;

    if (birthState) {
      birthPlace = `${birthState}, ${birthPlace}`;
    }

    if (birthCity) {
      birthPlace = `${birthCity}, ${birthPlace}`;
    }

    const results = {
      showNoResults: false,
      name: player.fullName,
      height: player.height,
      birthPlace,
      birthDate,
      number: player.primaryNumber,
      pos: player.primaryPosition.code,
      age: player.currentAge,
      shoots: player.shootsCatches,
      headshot,
      hero,
    };

    this.playerData.next(results);
  }
}
