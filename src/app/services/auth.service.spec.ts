import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { LinksService } from './links.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let linksServiceSpy: jasmine.SpyObj<LinksService>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('LinksService', ['getLinks']);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService,
        { provide: LinksService, useValue: spy}
      ]
    });
    service = TestBed.inject(AuthService);
    linksServiceSpy = TestBed.inject(LinksService) as jasmine.SpyObj<LinksService>;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get providers', async () => {
    const loginLink = "http://localhost:5051/api/login";
    const links = new Map<string, string>([
      ["login", loginLink]
    ]);
    linksServiceSpy.getLinks.and.returnValue(Promise.resolve(links));
    const providers = service.getProviders();
    await new Promise(resolve => setTimeout(resolve, 1));
    const requests = httpTestingController.expectOne(loginLink);
    const expectedProviders = new Map<string, string>([
      ["google", "http://localhost:5051/api/login/google"],
      ["facebook", "http://localhost:5051/api/login/facebook"],
      ["github", "http://localhost:5051/api/login/github"]
    ]);
    requests.flush(expectedProviders);
    expect(await providers).toEqual(expectedProviders);
  });

  it('check if logged in: is logged in', async () => {
    const links = new Map<string, string>([
      ["login", "http://localhost:5051/api/login"],
      ["logout", "http://localhost:5051/api/logout"]
    ]);
    linksServiceSpy.getLinks.and.returnValue(Promise.resolve(links));
    const isLoggedIn = await service.IsLoggedIn();
    expect(isLoggedIn).toBeTrue();
  });

  it('check if logged in: is not logged in', async () => {
    const links = new Map<string, string>([
      ["login", "http://localhost:5051/api/login"]
    ]);
    linksServiceSpy.getLinks.and.returnValue(Promise.resolve(links));
    const isLoggedIn = await service.IsLoggedIn();
    expect(isLoggedIn).toBeFalse();
  });
});