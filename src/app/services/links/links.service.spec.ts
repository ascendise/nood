import { TestBed } from '@angular/core/testing';
import { LinksService, RootLinks, LinksResponse, UnauthorizedError } from './links.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
import { AppConfig, AppConfigService } from '../app-config/app-config.service';

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
      clientId: ''
    }
  }
  const baseUri = config.apiBaseUri;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AppConfigService', ['loadConfig']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LinksService,
        { provide: AppConfigService, useValue: spy}
      ]
    });
    service = TestBed.inject(LinksService);
    configServiceSpy = TestBed.inject(AppConfigService) as jasmine.SpyObj<AppConfigService>;
    httpTestingController = TestBed.inject(HttpTestingController);
    configServiceSpy.loadConfig.and.returnValue(Promise.resolve(config))
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  })

  it('return unauthorizedError as anonymous user', async () =>{
    const expectedResponse = new UnauthorizedError();
    const linksRequest = service.getLinks();
    await waitForRequest();
    var request = httpTestingController.expectOne(baseUri)
    request.flush(expectedResponse);
    expect(await linksRequest).toEqual(expectedResponse);
  });

  it('return links as logged in user', async () =>{
    const expectedLinks: LinksResponse = {
      _links: {
        tasks: { href: `${baseUri}tasks` },
        checklists: { href: `${baseUri}checklists` },
        relations: { href: `${baseUri}checklists/tasks` },
      }
    };
    const expectedResponse = new HttpResponse<LinksResponse>({
      body: expectedLinks,
      status: 200
    });
    const linksRequest = service.getLinks();
    await waitForRequest();
    var request = httpTestingController.expectOne(baseUri)
    request.flush(expectedResponse);
    expect(await linksRequest).toEqual(expectedLinks._links);
  });

  it('cache links after retreiving them', async () =>{
    const expectedLinks: LinksResponse = {
      _links: {
        tasks: { href: `${baseUri}tasks` },
        checklists: { href: `${baseUri}checklists` },
        relations: { href: `${baseUri}checklists/tasks` }
      }
    };
    const expectedResponse = new HttpResponse<LinksResponse>({
      body: expectedLinks,
      status: 200
    });
    const firstFetchLinks = service.getLinks();
    await waitForRequest();
    const request = httpTestingController.expectOne(baseUri);
    request.flush(expectedResponse);
    await firstFetchLinks;
    const links = await service.getLinks();
    expect(links).toEqual(expectedLinks._links);
  });

});

async function waitForRequest() {
  await Promise.resolve((resolve: () => void) => setTimeout(resolve, 100));
}

