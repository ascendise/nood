import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from './services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy},
        { provide: Router, useValue: routerSpy }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should activate when user is logged in', async () => {
    authService.isLoggedIn.and.returnValue(Promise.resolve(true));
    var mockRouterState = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);
    const canActivate = guard.canActivate(new ActivatedRouteSnapshot(), mockRouterState) as Promise<boolean>;
    expect(await canActivate).toBeTrue();
  });

  it('should not activate when user is not logged in', async () => {
    authService.isLoggedIn.and.returnValue(Promise.resolve(false));
    var mockRouterState = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);
    const canActivate = guard.canActivate(new ActivatedRouteSnapshot(), mockRouterState) as Promise<boolean>;
    expect(await canActivate).toBeFalse();
  });

  it('should navigate to login page if user is not logged in', async () => {
    authService.isLoggedIn.and.returnValue(Promise.resolve(false));
    var mockRouterState = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);
    await guard.canActivate(new ActivatedRouteSnapshot(), mockRouterState);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not activate on error', async () => {
    authService.isLoggedIn.and.returnValue(Promise.reject('Test error'))
    var mockRouterState = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);
    const canActivate = guard.canActivate(new ActivatedRouteSnapshot(), mockRouterState) as Promise<boolean>;
    expect(await canActivate).toBeFalse();
  });

  it('should return to login page on error', async () => {
    authService.isLoggedIn.and.returnValue(Promise.reject('Test error'))
    var mockRouterState = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);
    await guard.canActivate(new ActivatedRouteSnapshot(), mockRouterState);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
