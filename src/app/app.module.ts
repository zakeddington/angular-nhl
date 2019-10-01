import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CONSTANTS } from './config/Constants';
import { ScheduleModule } from './schedule/schedule.module';
import { GameModule } from './game/game.module';
import { AppComponent } from './app.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { GameComponent } from './game/game.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/' + CONSTANTS.routePaths.schedule,
    pathMatch: 'full'
  },
  {
    path: CONSTANTS.routePaths.schedule,
    component: ScheduleComponent,
    data: { animRoute: 'schedule'}
  },
  {
    path: CONSTANTS.routePaths.schedule + '/:id',
    component: ScheduleComponent,
    data: { animRoute: 'schedule'}
  },
  {
    path: CONSTANTS.routePaths.game + '/:id',
    component: GameComponent,
    data: { animRoute: 'game'}
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
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {}
