import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { GameComponent } from './game.component';
import { GameHeaderComponent } from './game-header/game-header.component';
import { GameIntroComponent } from './game-intro/game-intro.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { GameStatsComponent } from './game-stats/game-stats.component';
import { PeriodSummaryComponent } from './period-summary/period-summary.component';
import { TeamStatsComponent } from './team-stats/team-stats.component';

@NgModule({
  declarations: [
    GameComponent,
    GameHeaderComponent,
    GameIntroComponent,
    ScoreboardComponent,
    GameStatsComponent,
    PeriodSummaryComponent,
    TeamStatsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ]
})
export class GameModule { }
