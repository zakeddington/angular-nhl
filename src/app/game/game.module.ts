import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GameComponent } from './game.component';
import { GameHeaderComponent } from './game-header/game-header.component';
import { SharedModule } from '../shared/shared.module';
import { GameIntroComponent } from './game-intro/game-intro.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { TeamStatsComponent } from './team-stats/team-stats.component';
import { PeriodSummaryComponent } from './period-summary/period-summary.component';

@NgModule({
  declarations: [
    GameComponent,
    GameHeaderComponent,
    GameIntroComponent,
    ScoreboardComponent,
    TeamStatsComponent,
    PeriodSummaryComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ]
})
export class GameModule { }
