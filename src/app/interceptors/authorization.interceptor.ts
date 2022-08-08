import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

  constructor(private oauthService: OAuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const idToken = this.oauthService.getIdToken();
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${idToken}` }
    });
    return next.handle(request);
  }
}
