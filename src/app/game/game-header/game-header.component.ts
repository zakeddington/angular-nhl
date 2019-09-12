import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GameService } from '../../services/game.service';
import { CONSTANTS } from '../../config/Constants';

@Component({
  selector: 'app-game-header',
  templateUrl: './game-header.component.html',
  styleUrls: ['./game-header.component.scss']
})
export class GameHeaderComponent implements OnInit, OnDestroy {
  data$: Observable<any>;
  subscription: Subscription = new Subscription();
  logoBaseUrl: string;

  constructor(private gameService: GameService) {
    this.data$ = this.gameService.subscribeToGameService();
  }

  ngOnInit() {
    this.logoBaseUrl = CONSTANTS.imgUrl.logoTeams.base;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
