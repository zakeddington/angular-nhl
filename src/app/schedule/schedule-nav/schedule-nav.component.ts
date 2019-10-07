import { Component, OnDestroy } from '@angular/core';
import {Router, ActivatedRoute, ParamMap, NavigationEnd} from '@angular/router';
import { CONSTANTS } from '../../config/Constants';
import * as moment from 'moment';
import { ScheduleService } from '../../services/schedule.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-schedule-nav',
  templateUrl: './schedule-nav.component.html',
  styleUrls: ['./schedule-nav.component.scss']
})
export class ScheduleNavComponent implements OnDestroy {
  curRouterDate: string;
  navDates: Array<any>;
  iconBaseUrl: string;
  routePath: string;
  routerSubscription: Subscription = new Subscription();

  constructor(
    private scheduleService: ScheduleService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.onRouterEvent();
    this.getRouterDate();
    this.iconBaseUrl = CONSTANTS.imgUrl.icon.base;
    this.routePath = '/' + CONSTANTS.routePaths.schedule;
  }

  onRouterEvent() {
    this.routerSubscription = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.initialize();
      }
    });
  }

  getRouterDate() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const routerDate = params.get('id');
      this.curRouterDate = routerDate ? routerDate : moment().format(CONSTANTS.momentOptions.apiFormat);
    });
  }

  initialize() {
    this.checkForStartDateInNav();
    this.scheduleService.getScheduleGames(this.curRouterDate, this.curRouterDate);
  }

  checkForStartDateInNav() {
    let isInNav = false;

    if (this.navDates) {
      if (this.navDates.filter(navDate => (navDate.urlDate === this.curRouterDate)).length) {
        isInNav = true;
      }
    }

    if (isInNav) {
      this.updateNavSelectedState();
    } else {
      this.createNavDates();
    }
  }

  createNavDates() {
    const curDay = this.curRouterDate ? moment(this.curRouterDate) : moment();
    let navDates = [
      {
        dateObj: curDay.clone().subtract(3, 'days'),
        isActive: false,
      },
      {
        dateObj: curDay.clone().subtract(2, 'days'),
        isActive: false,
      },
      {
        dateObj: curDay.clone().subtract(1, 'days'),
        isActive: false,
      },
      {
        dateObj: curDay,
        isActive: true,
      },
      {
        dateObj: curDay.clone().add(1, 'days'),
        isActive: false,
      },
      {
        dateObj: curDay.clone().add(2, 'days'),
        isActive: false,
      },
      {
        dateObj: curDay.clone().add(3, 'days'),
        isActive: false,
      }
    ];

    navDates = navDates.map(item => ({
      ...item,
      displayDate: item.dateObj.format(CONSTANTS.momentOptions.displayFormat),
      urlDate: item.dateObj.format(CONSTANTS.momentOptions.apiFormat),
    }));

    this.navDates = navDates;
  }

  updateNavSelectedState() {
    const curNavDates: Array<any> = this.navDates;

    curNavDates.forEach((navDate) => {
      navDate.isActive = this.curRouterDate === navDate.urlDate;
    });
  }

  onDateSelected(e) {
    const dateObj = moment(e.value);
    const urlDate = dateObj.format(CONSTANTS.momentOptions.apiFormat);
    this.router.navigate([this.routePath, urlDate]);
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
