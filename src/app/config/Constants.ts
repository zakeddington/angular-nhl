export const CONSTANTS = {
  routePaths: {
    schedule: 'schedule',
    game: 'game',
  },

  imgUrl: {
    icon: {
      base: '/assets/images/icons.svg#icon-',
    },
    logoTeams: {
      base: '/assets/images/logo-teams.svg#team-',
    },
    player: {
      base: '//nhl.bamcontent.com/images/',
      ext: '@2x.jpg',
      headshot: 'headshots/current/168x168/',
      hero: 'actionshots/',
      arena: 'arena/default/',
    }
  },

  lang: 'en-US',

  momentOptions: {
    apiFormat:  'YYYY-MM-DD',
    displayFormat: 'ddd, MMM D',
    birthFormat: 'MMMM D, YYYY',
  },

  dateOptions: {
    weekday : 'long',
    year    : 'numeric',
    month   : 'long',
    day     : 'numeric',
  },

  timeOptions: {
    timeZone     : 'America/New_York',
    hour         : '2-digit',
    minute       : '2-digit',
    timeZoneName : 'short',
  },
};
