import { trigger, animate, style, transition, state } from '@angular/animations';

export const tabsTransition = trigger('tabsTransition', [
  state('true', style({
    opacity: 1,
  })),
  state('false', style({
    opacity: 0,
  })),
  transition('false => true', [
    animate('0.5s ease-in-out')
  ]),
]);
