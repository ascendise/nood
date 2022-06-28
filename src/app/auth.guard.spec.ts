import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from './services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  beforeEach(() => {
    const spy = jasmine.createSpyObj("AuthService", ["isLoggedIn"]);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: spy}
      ]
    });
    guard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should activate when user is logged in', async () => {
    authServiceSpy.isLoggedIn.and.returnValue(Promise.resolve(true));
    var mockRouterState = jasmine.createSpyObj("RouterStateSnapshot", ["toString"]);
    const canActivate = guard.canActivate(new ActivatedRouteSnapshot(),mockRouterState) as Promise<boolean>;
    expect(await canActivate).toBeTrue();
  });

  it('should not activate when user is not logged in', async () => {
    authServiceSpy.isLoggedIn.and.returnValue(Promise.resolve(false));
    var mockRouterState = jasmine.createSpyObj("RouterStateSnapshot", ["toString"]);
    const canActivate = guard.canActivate(new ActivatedRouteSnapshot(),mockRouterState) as Promise<boolean>;
    expect(await canActivate).toBeFalse();
  });
});
