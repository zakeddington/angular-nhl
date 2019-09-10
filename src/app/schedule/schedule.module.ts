import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

import { ScheduleComponent } from './schedule.component';
import { ScheduleNavComponent } from './schedule-nav/schedule-nav.component';
import { ScheduleResultsComponent } from './schedule-results/schedule-results.component';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [
    ScheduleComponent,
    ScheduleNavComponent,
    ScheduleResultsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
})
export class ScheduleModule { }
