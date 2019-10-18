import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import {catchError, mergeMap, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  statsBaseUrl = 'https://statsapi.web.nhl.com/api/v1/';
  recordsBaseUrl = 'https://records.nhl.com/site/api/';

  constructor(private http: HttpClient) { }

  getGameDetail(gameId) {
    const url = `${this.statsBaseUrl}game/${gameId}/feed/live`;

    return this.getData(url).pipe(
      catchError(this.handleError)
    );
  }

  getGameContent(gameId) {
    const url = `${this.statsBaseUrl}game/${gameId}/content`;

    return this.getData(url).pipe(
      catchError(this.handleError)
    );
  }

  getSchedule(strStart, strEnd, arrParams) {
    let url = `${this.statsBaseUrl}schedule`;
    let params = '';

    if (arrParams) {
      params = `&${this.getQueryParams(arrParams)}`;
    }

    url += `?startDate=${strStart}&endDate=${strEnd}${params}`;

    return this.getData(url).pipe(
      catchError(this.handleError)
    );
  }

  getPlayerData(playerId) {
    const url = `${this.statsBaseUrl}people/${playerId}?expand=person.stats&stats=yearByYear,careerRegularSeason,yearByYearPlayoffs,careerPlayoffs&expand=stats.team&site=en_nhl`;

    return this.getData(url).pipe(
      // disabled due to cors error on records api
      // mergeMap(() => this.getPlayerDraftPos(playerId)),
      catchError(this.handleError)
    );
  }

  getPlayerDraftPos(playerId) {
    const url = `${this.recordsBaseUrl}draft?cayenneExp=player=${playerId}`;

    return this.getData(url).pipe(
      catchError(this.handleError)
    );
  }

  getQueryParams(arrParams) {
    const params = arrParams;
    let strParams = 'expand=';

    if (params.length) {
      strParams += params.join(',');
      return strParams;
    }
  }

  getData(url) {
    return this.http.get(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
