import { TestBed } from '@angular/core/testing';

import { AuthService, LoginLinks, LoginResponse } from './auth.service';
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
    const links: RootLinks = {
      login: { href: loginLink}
    };
    linksServiceSpy.getLinks.and.returnValue(Promise.resolve(links));
    const providers = service.getProviders();
    await new Promise(resolve => setTimeout(resolve, 1));
    const requests = httpTestingController.expectOne(loginLink);
    const expectedProviders: LoginResponse = {
      _links: {
        google: { href: `${baseUri}/login/google`},
        self: { href: loginLink }
      }
    }
    requests.flush(expectedProviders);
    expect(await providers).toEqual(expectedProviders._links);
  });

  it('check if logged in: is logged in', async () => {
    const links: RootLinks = {
      login: { href: `${baseUri}/login`},
      tasks: { href: `${baseUri}/tasks`},
      checklists: { href: `${baseUri}/checklists`},
      relations: { href: `${baseUri}/checklists/tasks`},
      logout: { href: `${baseUri}/logout`}
    }
    linksServiceSpy.getLinks.and.returnValue(Promise.resolve(links));
    const isLoggedIn = await service.isLoggedIn();
    expect(isLoggedIn).toBeTrue();
  });

  it('check if logged in: is not logged in', async () => {
    const links: RootLinks = {
      login: { href: `${baseUri}/login`}
    }
    linksServiceSpy.getLinks.and.returnValue(Promise.resolve(links));
    const isLoggedIn = await service.isLoggedIn();
    expect(isLoggedIn).toBeFalse();
  });
});
