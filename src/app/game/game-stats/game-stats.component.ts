import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GameService } from '../../services/game.service';
import { CONSTANTS } from '../../config/Constants';

@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.scss']
})
export class GameStatsComponent implements OnInit, OnDestroy {
  data$: Observable<any>;
  subscription: Subscription = new Subscription();
  logoBaseUrl: string;

  constructor(private gameService: GameService) {
    this.data$ = this.gameService.subscribeToGameData();
  }

  ngOnInit() {
    this.logoBaseUrl = CONSTANTS.imgUrl.logoTeams.base;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
