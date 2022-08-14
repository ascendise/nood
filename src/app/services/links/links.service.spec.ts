import { TestBed } from '@angular/core/testing';
import { LinksService, RootLinks, LinksResponse, UnauthorizedError } from './links.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';

describe('LinksService', () => {
  let service: LinksService;
  let httpTestingController: HttpTestingController;

  const baseUri: string = 'http://localhost:5051/api/'

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LinksService]
    });
    service = TestBed.inject(LinksService);
    httpTestingController = TestBed.inject(HttpTestingController);
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
    const request = httpTestingController.expectOne(baseUri);
    request.flush(expectedResponse);
    await firstFetchLinks;
    const links = await service.getLinks();
    expect(links).toEqual(expectedLinks._links);
  });

});
