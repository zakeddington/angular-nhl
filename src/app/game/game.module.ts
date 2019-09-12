import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GameComponent } from './game.component';
import { GameHeaderComponent } from './game-header/game-header.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    GameComponent,
    GameHeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ]
})
export class GameModule { }
