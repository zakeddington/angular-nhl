import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CONSTANTS } from './config/Constants';
import { ScheduleModule } from './schedule/schedule.module';
import { GameModule } from './game/game.module';
import { AppComponent } from './app.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { GameComponent } from './game/game.component';

const appRoutes: Routes = [
  { path: '',
    redirectTo: '/' + CONSTANTS.routePaths.schedule,
    pathMatch: 'full'
  },
  {
    path: CONSTANTS.routePaths.schedule,
    component: ScheduleComponent,
  },
  {
    path: CONSTANTS.routePaths.schedule + '/:id',
    component: ScheduleComponent,
  },
  {
    path: CONSTANTS.routePaths.game + '/:id',
    component: GameComponent,
  }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ScheduleModule,
    GameModule,
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {}
