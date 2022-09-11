import { trigger, transition, style, animate, query, animateChild, group } from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ right: '-100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('100ms ease-out', style({ right: '100%', opacity: 0 }))]),
      query(':enter', [animate('100ms ease-out', style({ right: '0%' }))]),
      query('@*', animateChild(), { optional: true }),
    ]),
  ]),
]);
