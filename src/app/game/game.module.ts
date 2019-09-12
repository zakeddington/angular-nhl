import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GameComponent } from './game.component';
import { GameHeaderComponent } from './game-header/game-header.component';
import { SharedModule } from '../shared/shared.module';
import { GameIntroComponent } from './game-intro/game-intro.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { StarsComponent } from './stars/stars.component';
import { TeamStatsComponent } from './team-stats/team-stats.component';

@NgModule({
  declarations: [
    GameComponent,
    GameHeaderComponent,
    GameIntroComponent,
    ScoreboardComponent,
    StarsComponent,
    TeamStatsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ]
})
export class GameModule { }
