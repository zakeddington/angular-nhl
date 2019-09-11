import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CONSTANTS } from './config/Constants';
import { ScheduleModule } from './schedule/schedule.module';
import { AppComponent } from './app.component';
import { ScheduleComponent } from './schedule/schedule.component';

const appRoutes: Routes = [
  // { path: 'hero/:id',      component: HeroDetailComponent },
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  { path: '',
    redirectTo: '/' + CONSTANTS.routePaths.schedule,
    pathMatch: 'full'
  },
  {
    path: CONSTANTS.routePaths.schedule,
    component: ScheduleComponent,
  },
  {
    path: 'schedule/:id',
    component: ScheduleComponent,
  }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ScheduleModule,
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
