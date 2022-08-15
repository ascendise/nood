import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: OAuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const requiresLogin = (route.data['requiresLogin'] as boolean) || false;
    const isLoggedIn = this.authService.hasValidIdToken();
    if (requiresLogin == isLoggedIn) {
      return true;
    }
    const redirectTo = route.data['redirectTo'] as string;
    this.router.navigate([redirectTo]);
    return false;
  }
}
