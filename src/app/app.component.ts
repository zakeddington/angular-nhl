import { Component } from '@angular/core';
import { routerTransition } from './router.animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ routerTransition ],
})
export class AppComponent {
  title = 'angular-nhl';

  animateRoute(outlet) {
    return outlet.activatedRouteData.animRoute;
  }
}
