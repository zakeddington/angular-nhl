import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GameService } from '../../services/game.service';
import { CONSTANTS } from '../../config/Constants';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss']
})
export class PlayerStatsComponent implements OnInit, OnDestroy {
  data$: Observable<any>;
  subscription: Subscription = new Subscription();
  logoBaseUrl: string;

  constructor(private gameService: GameService) {
    this.data$ = this.gameService.subscribeToGamePlayerData();
  }

  ngOnInit() {
    this.logoBaseUrl = CONSTANTS.imgUrl.logoTeams.base;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
