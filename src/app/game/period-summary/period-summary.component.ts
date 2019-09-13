import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GameService } from '../../services/game.service';
import { CONSTANTS } from '../../config/Constants';

@Component({
  selector: 'app-period-summary',
  templateUrl: './period-summary.component.html',
  styleUrls: ['./period-summary.component.scss']
})
export class PeriodSummaryComponent implements OnInit, OnDestroy {
  data$: Observable<any>;
  subscription: Subscription = new Subscription();
  logoBaseUrl: string;

  constructor(private gameService: GameService) {
    this.data$ = this.gameService.subscribeToGamePeriodData();
  }

  ngOnInit() {
    this.logoBaseUrl = CONSTANTS.imgUrl.logoTeams.base;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
