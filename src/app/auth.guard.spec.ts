import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<OAuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('OAuthService', ['hasValidIdToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthGuard,
        { provide: OAuthService, useValue: authSpy},
        { provide: Router, useValue: routerSpy }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(OAuthService) as jasmine.SpyObj<OAuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should activate when user is logged in', async () => {
    authService.hasValidIdToken.and.returnValue(true);
    var mockRouterState = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);
    const canActivate = guard.canActivate(new ActivatedRouteSnapshot(), mockRouterState) as Promise<boolean>;
    expect(await canActivate).toBeTrue();
  });

  it('should not activate when user is not logged in', async () => {
    authService.hasValidIdToken.and.returnValue(false);
    var mockRouterState = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);
    const canActivate = guard.canActivate(new ActivatedRouteSnapshot(), mockRouterState) as Promise<boolean>;
    expect(await canActivate).toBeFalse();
  });

  it('should navigate to anonymous page if user is not logged in', async () => {
    authService.hasValidIdToken.and.returnValue(false);
    var mockRouterState = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);
    await guard.canActivate(new ActivatedRouteSnapshot(), mockRouterState);
    expect(router.navigate).toHaveBeenCalledWith(['/anonymous']);
  });
});
