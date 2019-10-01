import { trigger, animate, style, group, query, transition } from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
  transition('* <=> *', [
    query(':enter, :leave',
      style({
        display: 'block',
        position: 'absolute',
        left: 20,
        top: 20,
        width: 'calc(100% - 40px)',
      }),
      { optional: true }),
    group([
      query(':enter', [
        style({
          opacity: 0,
        }),
        animate('0.5s ease-in-out',
          style({
            opacity: 1,
          }))
      ], { optional: true }),
      query(':leave', [
        style({
          opacity: 1,
        }),
        animate('0s ease-in-out',
          style({
            opacity: 0,
          }))
      ], { optional: true }),
    ])
  ])
]);
