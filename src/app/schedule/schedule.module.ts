import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

import { ScheduleComponent } from './schedule.component';
import { ScheduleNavComponent } from './schedule-nav/schedule-nav.component';
import { ScheduleResultsComponent } from './schedule-results/schedule-results.component';


@NgModule({
  declarations: [
    ScheduleComponent,
    ScheduleNavComponent,
    ScheduleResultsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
})
export class ScheduleModule { }
