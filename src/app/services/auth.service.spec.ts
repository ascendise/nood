import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { LinksService, RootLinks } from './links.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let linksServiceSpy: jasmine.SpyObj<LinksService>;
  let httpTestingController: HttpTestingController;

  const baseUri = 'http://localhost:5051/api';

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
    const loginLink = `${baseUri}/login`;
    const links = new RootLinks(
      { href: loginLink}
    )
    linksServiceSpy.getLinks.and.returnValue(Promise.resolve(links));
    const providers = service.getProviders();
    await new Promise(resolve => setTimeout(resolve, 1));
    const requests = httpTestingController.expectOne(loginLink);
    const expectedProviders = new Map<string, string>([
      ['google', `${baseUri}/login/google`],
      ['facebook', `${baseUri}/login/facebook`],
      ['github', `${baseUri}/login/github`]
    ]);
    requests.flush(expectedProviders);
    expect(await providers).toEqual(expectedProviders);
  });

  it('check if logged in: is logged in', async () => {
    const links = new RootLinks(
      { href: `${baseUri}/login`},
      { href: `${baseUri}/tasks`},
      { href: `${baseUri}/checklists`},
      { href: `${baseUri}/relations`},
      { href: `${baseUri}/logout`}
    )
    linksServiceSpy.getLinks.and.returnValue(Promise.resolve(links));
    const isLoggedIn = await service.isLoggedIn();
    expect(isLoggedIn).toBeTrue();
  });

  it('check if logged in: is not logged in', async () => {
    const links = new RootLinks(
      { href: `${baseUri}/login`}
    )
    linksServiceSpy.getLinks.and.returnValue(Promise.resolve(links));
    const isLoggedIn = await service.isLoggedIn();
    expect(isLoggedIn).toBeFalse();
  });
});
