import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { ScheduleComponent } from './schedule.component';
import { ScheduleNavComponent } from './schedule-nav/schedule-nav.component';
import { ScheduleResultsComponent } from './schedule-results/schedule-results.component';
import { IconComponent } from '../shared/logo/icon.component';

@NgModule({
  declarations: [
    ScheduleComponent,
    ScheduleNavComponent,
    ScheduleResultsComponent,
    IconComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
})
export class ScheduleModule { }
