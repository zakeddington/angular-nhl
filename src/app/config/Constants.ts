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
      base: '//nhl.bamcontent.com/images/headshots/current/60x60/',
      ext: '@2x.jpg',
    }
  },

  lang: 'en-US',

  momentOptions: {
    apiFormat:  'YYYY-MM-DD',
    displayFormat: 'ddd, MMM D',
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

  isMobileView: null,
  isTabletView: null,
  isDesktopView: null,

  currentBreakpoint: null,

  breakpoints: {
    1: 'mobile',
    2: 'tablet',
    3: 'desktop'
  }
};
