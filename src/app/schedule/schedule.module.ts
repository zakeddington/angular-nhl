import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { ScheduleComponent } from './schedule.component';
import { ScheduleNavComponent } from './schedule-nav/schedule-nav.component';
import { ScheduleResultsComponent } from './schedule-results/schedule-results.component';
import { SharedModule } from '../shared/shared.module';

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
    SharedModule,
  ],
})
export class ScheduleModule { }
