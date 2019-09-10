import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

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
  // { path: '',
  //   redirectTo: '/schedule',
  //   pathMatch: 'full'
  // },
  {
    path: '',
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
