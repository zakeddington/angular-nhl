import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { Subscription } from 'rxjs';
import { CONSTANTS } from '../../config/Constants';

@Component({
  selector: 'app-schedule-results',
  templateUrl: './schedule-results.component.html',
  styleUrls: ['./schedule-results.component.scss']
})
export class ScheduleResultsComponent implements OnInit, OnDestroy {
  data$: any;
  subscription: Subscription;
  route: string;

  constructor(private scheduleService: ScheduleService) {
    this.data$ = this.scheduleService.subscribeToScheduleService();
  }

  ngOnInit() {
    this.route = CONSTANTS.routePaths.game;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
