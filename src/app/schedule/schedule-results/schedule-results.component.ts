import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, animate, style, query, stagger } from '@angular/animations';
import { ScheduleService } from '../../services/schedule.service';
import { Observable, Subscription } from 'rxjs';
import { CONSTANTS } from '../../config/Constants';

@Component({
  selector: 'app-schedule-results',
  templateUrl: './schedule-results.component.html',
  styleUrls: ['./schedule-results.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-30px)' }),
          stagger(30, [
            animate('0.3s ease-out',
              style({ opacity: 1, transform: 'none' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class ScheduleResultsComponent implements OnInit, OnDestroy {
  data$: Observable<any>;
  subscription: Subscription = new Subscription();
  routePath: string;
  logoBaseUrl: string;

  constructor(private scheduleService: ScheduleService) {
    this.data$ = this.scheduleService.subscribeToScheduleService();
  }

  ngOnInit() {
    this.routePath = '/' + CONSTANTS.routePaths.game;
    this.logoBaseUrl = CONSTANTS.imgUrl.logoTeams.base;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
