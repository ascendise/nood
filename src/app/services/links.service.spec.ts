import { TestBed } from '@angular/core/testing';
import { LinksService, RootLinks, LinksResponse } from './links.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

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

  it('return links as anonymous user', async () =>{
    const expectedLinks: LinksResponse = {
      _links: {
        login: { href: `${baseUri}login` }
      }
    };
    const linksRequest = service.getLinks();
    var request = httpTestingController.expectOne(baseUri)
    request.flush(expectedLinks);
    expect(await linksRequest).toEqual(expectedLinks._links);
  });

  it('return links as logged in user', async () =>{
    const expectedLinks: LinksResponse = {
      _links: {
        login: { href: `${baseUri}login` },
        tasks: { href: `${baseUri}tasks` },
        checklists: { href: `${baseUri}checklists` },
        relations: { href: `${baseUri}checklists/tasks` },
        logout: { href: `${baseUri}logout` }
      }
    };
    const linksRequest = service.getLinks();
    var request = httpTestingController.expectOne(baseUri)
    request.flush(expectedLinks);
    expect(await linksRequest).toEqual(expectedLinks._links);
  });

  it('cache links after retreiving them', async () =>{
    const expectedLinks: LinksResponse = {
      _links: {
        login: { href: `${baseUri}login` },
        tasks: { href: `${baseUri}tasks` },
        checklists: { href: `${baseUri}checklists` },
        relations: { href: `${baseUri}checklists/tasks` },
        logout: { href: `${baseUri}logout` }
      }
    };
    const firstFetchLinks = service.getLinks();
    const request = httpTestingController.expectOne(baseUri);
    request.flush(expectedLinks);
    await firstFetchLinks;
    const links = await service.getLinks();
    expect(links).toEqual(expectedLinks._links);
  });

  it('add cached links after login', async () =>{
    const expectedAnonLinks: LinksResponse = {
      _links: {
        login: { href: `${baseUri}login` }
      }
    };
    const expectedUserLinks: LinksResponse = {
      _links: {
        login: { href: `${baseUri}login` },
        tasks: { href: `${baseUri}tasks` },
        checklists: { href: `${baseUri}checklists` },
        relations: { href: `${baseUri}checklists/tasks` },
        logout: { href: `${baseUri}logout` }
      }
    };
    const anonymousLinks = service.getLinks();
    const anonymousLinksRequest = httpTestingController.expectOne(baseUri);
    anonymousLinksRequest.flush(expectedAnonLinks);
    await expectedAnonLinks;
    const userLinks = service.getLinks();
    const userLinksRequest = httpTestingController.expectOne(baseUri)
    userLinksRequest.flush(expectedUserLinks);
    await userLinks;
    const cachedLinks = await service.getLinks();
    httpTestingController.expectNone(baseUri)
    expect(cachedLinks).toEqual(expectedUserLinks._links);
  });

});
