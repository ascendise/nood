import { TestBed } from '@angular/core/testing';
import { LinksService, LinksResponse, UnauthorizedError } from './links.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfig, AppConfigService } from '../app-config/app-config.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('LinksService', () => {
  let service: LinksService;
  let configServiceSpy: jasmine.SpyObj<AppConfigService>;
  let httpTestingController: HttpTestingController;

  const config: AppConfig = {
    apiBaseUri: 'http://localhost:5051/api/',
    oauth: {
      issuer: '',
      redirectUri: '',
      audience: '',
      loginUrl: '',
      logoutUrl: '',
      clientId: '',
    },
    appDomain: '',
  };
  const baseUri = config.apiBaseUri;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AppConfigService', ['loadConfig']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LinksService, { provide: AppConfigService, useValue: spy }],
    });
    service = TestBed.inject(LinksService);
    configServiceSpy = TestBed.inject(AppConfigService) as jasmine.SpyObj<AppConfigService>;
    httpTestingController = TestBed.inject(HttpTestingController);
    configServiceSpy.loadConfig.and.returnValue(Promise.resolve(config));
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('throw unauthorizedError as anonymous user', async () => {
    try {
      const linksRequest = service.getLinks();
      await waitForRequest();
      const request = httpTestingController.expectOne(baseUri);
      request.flush(null, { status: 401, statusText: 'Unauthorized' });
      await linksRequest;
      fail();
    } catch (err) {
      console.log(err);
      expect(err).toBeInstanceOf(UnauthorizedError);
    }
  });

  it('return links as logged in user', async () => {
    const expectedLinks: LinksResponse = {
      _links: {
        tasks: { href: `${baseUri}tasks` },
        checklists: { href: `${baseUri}checklists` },
        relations: { href: `${baseUri}checklists/tasks` },
      },
    };
    const linksRequest = service.getLinks();
    await waitForRequest();
    const request = httpTestingController.expectOne(baseUri);
    request.flush(expectedLinks, { status: 200, statusText: 'OK' });
    expect(await linksRequest).toEqual(expectedLinks._links);
  });

  it('cache links after retreiving them', async () => {
    const expectedLinks: LinksResponse = {
      _links: {
        tasks: { href: `${baseUri}tasks` },
        checklists: { href: `${baseUri}checklists` },
        relations: { href: `${baseUri}checklists/tasks` },
      },
    };
    const firstFetchLinks = service.getLinks();
    await waitForRequest();
    const request = httpTestingController.expectOne(baseUri);
    request.flush(expectedLinks, { status: 200, statusText: 'OK' });
    await firstFetchLinks;
    const links = await service.getLinks();
    expect(links).toEqual(expectedLinks._links);
  });

  it('should let error bubble up if not 401', async () => {
    try {
      const linksRequest = service.getLinks();
      await waitForRequest();
      const request = httpTestingController.expectOne(baseUri);
      request.flush(null, { status: 500, statusText: 'Internal Server Error' });
      await linksRequest;
      fail();
    } catch (err) {
      console.log(err);
      expect(err).toBeInstanceOf(HttpErrorResponse);
    }
  })
});

async function waitForRequest() {
  await Promise.resolve((resolve: () => void) => setTimeout(resolve, 100));
}
