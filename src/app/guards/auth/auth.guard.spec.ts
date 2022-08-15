import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Data, Router } from '@angular/router';
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
      imports: [HttpClientTestingModule],
      providers: [
        AuthGuard,
        { provide: OAuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(OAuthService) as jasmine.SpyObj<OAuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should activate if requiresLogin matches login state', async () => {
    authService.hasValidIdToken.and.returnValue(false);
    const data: Data = {
      requiresLogin: false,
      redirectTo: '/protected',
    };
    const route = new ActivatedRouteSnapshot();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (route as any).data = data;
    const canActivate = guard.canActivate(route);
    expect(await canActivate).toBeTrue();
  });

  it('should not activate if requiresLogin does not match login state', async () => {
    authService.hasValidIdToken.and.returnValue(false);
    const data: Data = {
      requiresLogin: true,
      redirectTo: '/home',
    };
    const route = new ActivatedRouteSnapshot();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (route as any).data = data;
    const canActivate = guard.canActivate(route);
    expect(await canActivate).toBeFalse();
  });

  it('should redirect to specified location if requiresLogin does not match login state', async () => {
    authService.hasValidIdToken.and.returnValue(false);
    const data: Data = {
      requiresLogin: true,
      redirectTo: '/home',
    };
    const route = new ActivatedRouteSnapshot();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (route as any).data = data;
    await guard.canActivate(route);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});
