import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-intro',
  templateUrl: './game-intro.component.html',
  styleUrls: ['./game-intro.component.scss']
})
export class GameIntroComponent implements OnDestroy {
  data$: Observable<any>;
  subscription: Subscription = new Subscription();

  constructor(private gameService: GameService) {
    this.data$ = this.gameService.subscribeToGameContent();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
