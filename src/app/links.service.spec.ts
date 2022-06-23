import { TestBed } from '@angular/core/testing';
import { LinksService } from './links.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

describe('LinksService', () => {
  let service: LinksService;
  let httpTestingController: HttpTestingController;

  const baseUri: string = "https://localhost:5051/api/"

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

  it("should be created", () => {
    expect(service).toBeTruthy();
  })

  it("return links as anonymous user", (done) =>{
    const expectedLinks = new Map<string, string>([
      ["login", `${baseUri}login`]
    ]);
    const links = service.getLinks();
    links.subscribe((value: Map<string, string>) =>{
      expect(value).toEqual(expectedLinks);
      done();
    });
    var request = httpTestingController.expectOne(baseUri)
    request.flush(expectedLinks);
  });

  it("return links as logged in user", (done =>{
    const expectedLinks = new Map<string, string>([
      ["login", `${baseUri}login`],
      ["logout", `${baseUri}logout`],
      ["tasks", `${baseUri}tasks`],
      ["checklists", `${baseUri}checklists`],
      ["relations", `${baseUri}tasks`],
    ]);
    const links = service.getLinks();
    links.subscribe((value: Map<string, string>) =>{
      expect(value).toEqual(expectedLinks);
      done();
    });
    var request = httpTestingController.expectOne(baseUri)
    request.flush(expectedLinks);
  }));

  it("cache links after retreiving them", (done =>{
    const expectedLinks = new Map<string, string>([
      ["login", `${baseUri}login`],
      ["logout", `${baseUri}logout`],
      ["tasks", `${baseUri}tasks`],
      ["checklists", `${baseUri}checklists`],
      ["relations", `${baseUri}tasks`],
    ]);
    service.getLinks().subscribe((links: Map<string, string>) =>{
      service.getLinks().subscribe((cachedLinks: Map<string, string>) =>{
        expect(cachedLinks).toEqual(expectedLinks);
        done();
      });
    });
    var request = httpTestingController.expectOne(baseUri);
    request.flush(expectedLinks);
  }));

  it("add cached links after login", (done =>{
    const anonymousLinks = new Map<string, string>([
      ["login", `${baseUri}login`]
    ]);
    const userLinks = new Map<string, string>([
      ["login", `${baseUri}login`],
      ["logout", `${baseUri}logout`],
      ["tasks", `${baseUri}tasks`],
      ["checklists", `${baseUri}checklists`],
      ["relations", `${baseUri}tasks`],
    ]);
    service.getLinks().subscribe((anonymousLinks: Map<string, string>) =>{
      service.getLinks().subscribe((userLinks: Map<string, string>) => {
        service.getLinks().subscribe((cachedLinks: Map<string, string>) => {
          expect(cachedLinks).toEqual(userLinks);
          done();
        });
        httpTestingController.expectNone(baseUri)
      });
      const userLinksRequest = httpTestingController.expectOne(baseUri)
      userLinksRequest.flush(userLinks);
    })
    const anonymousLinksRequest = httpTestingController.expectOne(baseUri);
    anonymousLinksRequest.flush(anonymousLinks);
  }));

});
