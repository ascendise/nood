import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.isLoggedIn()
      .then(isLoggedIn => {
        if(!isLoggedIn)
        {
          console.log('redirect');
          this.router.navigate(["/anonymous"]);
        }
        return isLoggedIn;
      })
      .catch(() => {
        this.router.navigate(["/anonymous"]);
        return false;
      });
  }

}
