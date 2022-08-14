import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { LinksService, RootLinks, UnauthorizedError } from '../links/links.service';
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

  it('check if logged in: is logged in', async () => {
    const links: RootLinks = {
      tasks: { href: `${baseUri}/tasks`},
      checklists: { href: `${baseUri}/checklists`},
      relations: { href: `${baseUri}/checklists/tasks`}
    }

    linksServiceSpy.getLinks.and.returnValue(Promise.resolve(links));
    const isLoggedIn = await service.isLoggedIn();
    expect(isLoggedIn).toBeTrue();
  });

  it('check if logged in: is not logged in', async () => {
    linksServiceSpy.getLinks.and.returnValue(Promise.resolve(new UnauthorizedError()));
    const isLoggedIn = await service.isLoggedIn();
    expect(isLoggedIn).toBeFalse();
  });
});
