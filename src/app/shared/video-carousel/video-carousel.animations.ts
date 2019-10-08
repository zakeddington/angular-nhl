import { trigger, animate, style, transition, state } from '@angular/animations';

export const videoTransition = trigger('videoTransition', [
  state('true', style({
    opacity: 1,
  })),
  state('false', style({
    opacity: 0,
  })),
  transition('false => true', [
    animate('5s ease-in-out')
  ]),
]);
