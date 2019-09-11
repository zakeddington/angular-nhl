import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CONSTANTS } from '../../config/Constants';
import * as moment from 'moment';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-schedule-nav',
  templateUrl: './schedule-nav.component.html',
  styleUrls: ['./schedule-nav.component.scss']
})
export class ScheduleNavComponent implements OnInit {
  selectedDate: object;
  navDates: object[];
  startDate: object;
  apiStartDate: string;
  iconBaseUrl: string;
  routePath: string;

  getScheduleStartDate() {
    console.log(this.route);
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.setStartDate(params.get('id'));
    });
  }

  setStartDate(date) {
    const dateFormat = CONSTANTS.momentOptions.apiFormat;
    let startDate = moment();

    if (date) {
      startDate = moment(date, dateFormat);
    }

    this.startDate = startDate;
    this.apiStartDate = startDate.format(CONSTANTS.momentOptions.apiFormat);
  }

  constructor(
    private scheduleService: ScheduleService,
    private route: ActivatedRoute,
  ) {
    this.getScheduleStartDate();
    this.iconBaseUrl = CONSTANTS.imgUrl.icon.base;
    this.routePath = '/' + CONSTANTS.routePaths.schedule;
  }

  ngOnInit() {
    this.setNavDates(this.startDate);
    this.scheduleService.getScheduleGames(this.apiStartDate, this.apiStartDate);
  }

  setNavDates(dateObj) {
    const curDay = dateObj;

    let navDates = [
      {
        day: curDay.clone().subtract(3, 'days'),
        isActive: false,
      },
      {
        day: curDay.clone().subtract(2, 'days'),
        isActive: false,
      },
      {
        day: curDay.clone().subtract(1, 'days'),
        isActive: false,
      },
      {
        day: curDay,
        isActive: true,
      },
      {
        day: curDay.clone().add(1, 'days'),
        isActive: false,
      },
      {
        day: curDay.clone().add(2, 'days'),
        isActive: false,
      },
      {
        day: curDay.clone().add(3, 'days'),
        isActive: false,
      }
    ];

    navDates = navDates.map(item => ({
      ...item,
      displayDate: item.day.format(CONSTANTS.momentOptions.displayFormat),
      urlDate: item.day.format(CONSTANTS.momentOptions.apiFormat),
    }));

    this.selectedDate = curDay;
    this.navDates = navDates;
  }

  onNavClick(e, dateObj) {
    e.preventDefault();
    const curDateObj = dateObj;
    const curNavDates: Array<any> = this.navDates;
    const urlDate = curDateObj.day.format(CONSTANTS.momentOptions.apiFormat);

    curNavDates.forEach((navDate) => {
      navDate.isActive = curDateObj.day === navDate.day;
    });

    this.selectedDate = curDateObj.day;
    this.navDates = curNavDates;

    this.scheduleService.getScheduleGames(urlDate, urlDate);
  }

  onDateSelected(e) {
    const dateObj = moment(e.value);
    const urlDate = dateObj.format(CONSTANTS.momentOptions.apiFormat);

    this.setNavDates(dateObj);
    this.scheduleService.getScheduleGames(urlDate, urlDate);
  }
}
