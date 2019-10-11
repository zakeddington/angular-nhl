
import { CONSTANTS } from '../config/Constants';

export const UTILS = {
  getGameStatus(linescoreData) {
    const data = linescoreData;
    const curPeriod = data.currentPeriod;
    const curPeriodName = data.currentPeriodOrdinal;
    const curTime = data.currentPeriodTimeRemaining;
    let curStatus = '';

    if (curPeriod > 0) {
      if (curTime !== 'Final') {
        curStatus = `${curPeriodName} | ${curTime}`;
      } else {
        if (curPeriod === 3) {
          curStatus = `${curTime}`;
        } else {
          curStatus = `${curTime}/${curPeriodName}`;
        }
      }
    }

    return curStatus;
  },

  getPeriodStats(periodGoals, awayScore, homeScore, shootoutGoals) {
    const periods = [];
    const periodsTotal = ['T', awayScore, homeScore];

    if (periodGoals.length) {
      periodGoals.forEach((period) => {
        const curPeriod = [];
        const periodName = period.ordinalNum;
        const awayGoals = period.away.goals;
        const homeGoals = period.home.goals;

        if (periodName === 'OT') {
          if (awayGoals + homeGoals <= 0) {
            curPeriod.push('SO');
            curPeriod.push(shootoutGoals.away.scores);
            curPeriod.push(shootoutGoals.home.scores);
          } else {
            curPeriod.push(periodName);
            curPeriod.push(awayGoals);
            curPeriod.push(homeGoals);
          }
        } else {
          curPeriod.push(periodName);
          curPeriod.push(awayGoals);
          curPeriod.push(homeGoals);
        }

        periods.push(curPeriod);
      });

      periods.push(periodsTotal);
    }

    return periods;
  },

  getStarStats(star, boxscoreTeams) {
    let stats;
    const starId = star.id;
    const starName = star.fullName;
    const playerKey = `ID${starId}`;
    let teamName;
    let teamId;
    let position;
    let stat1;
    let stat2;

    let playerData = boxscoreTeams.away.players[playerKey];

    if (playerData) {
      teamName = boxscoreTeams.away.team.triCode;
      teamId = boxscoreTeams.away.team.id;
    } else {
      playerData = boxscoreTeams.home.players[playerKey];
      teamName = boxscoreTeams.home.team.triCode;
      teamId = boxscoreTeams.home.team.id;
    }

    position = playerData.position.code;

    if (position === 'G') {
      let savePercent = playerData.stats.goalieStats.savePercentage;

      savePercent = (savePercent / 100).toFixed(3);

      stat1 = `Saves: ${playerData.stats.goalieStats.saves}`;
      stat2 = `Save %: ${savePercent}`;
    } else {
      stat1 = `Goals: ${playerData.stats.skaterStats.goals}`;
      stat2 = `Assists: ${playerData.stats.skaterStats.assists}`;
    }


    stats = {
      id: starId,
      name: starName,
      photo: `${CONSTANTS.imgUrl.player.base}${CONSTANTS.imgUrl.player.headshot}${starId}${CONSTANTS.imgUrl.player.ext}`,
      stat1: stat1,
      stat2: stat2,
      teamName: teamName,
      teamId: teamId,
    };

    return stats;
  }
};
