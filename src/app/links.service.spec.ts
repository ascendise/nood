import { TestBed } from '@angular/core/testing';
import { LinksService } from './links.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

describe('LinksService', () => {
  let service: LinksService;
  let httpTestingController: HttpTestingController;

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
      ["login", "https://localhost:5051/api/login"]
    ]);
    const links = service.getLinks();
    links.subscribe((value: Map<string, string>) =>{
      expect(value).toEqual(expectedLinks);
      done();
    });
    var request = httpTestingController.match("https://localhost:5051/api/")
    expect(request.length).toBe(2);
    request.forEach((r: TestRequest) => {
      r.flush(expectedLinks);
    });
  });

  it("return links as logged in user", (done =>{
    const expectedLinks = new Map<string, string>([
      ["login", "https://localhost:5051/api/login"],
      ["logout", "https://localhost:5051/api/logout"],
      ["tasks", "https://localhost:5051/api/tasks"],
      ["checklists", "https://localhost:5051/api/checklists"],
      ["relations", "https://localhost:5051/api/checklists/tasks"],
    ]);
    const links = service.getLinks();
    links.subscribe((value: Map<string, string>) =>{
      expect(value).toEqual(expectedLinks);
      done();
    });
    var request = httpTestingController.match("https://localhost:5051/api/")
    expect(request.length).toBe(2);
    request.forEach((r: TestRequest) => {
      r.flush(expectedLinks);
    });
  }));

  it("cache links after retreiving them", (done =>{
    const expectedLinks = new Map<string, string>([
      ["login", "https://localhost:5051/api/login"],
      ["logout", "https://localhost:5051/api/logout"],
      ["tasks", "https://localhost:5051/api/tasks"],
      ["checklists", "https://localhost:5051/api/checklists"],
      ["relations", "https://localhost:5051/api/checklists/tasks"],
    ]);
    service.getLinks().subscribe((links: Map<string, string>) =>{
      service.getLinks().subscribe((cachedLinks: Map<string, string>) =>{
        expect(cachedLinks).toEqual(expectedLinks);
        done();
      });
    });
    var request = httpTestingController.match("https://localhost:5051/api/")
    expect(request.length).toBe(2);
    request.forEach((r: TestRequest) => {
      r.flush(expectedLinks);
    });
  }));

  it("add cached links after login", (done =>{
    const anonymousLinks = new Map<string, string>([
      ["login", "https://localhost:5051/api/login"]
    ]);
    const userLinks = new Map<string, string>([
      ["login", "https://localhost:5051/api/login"],
      ["logout", "https://localhost:5051/api/logout"],
      ["tasks", "https://localhost:5051/api/tasks"],
      ["checklists", "https://localhost:5051/api/checklists"],
      ["relations", "https://localhost:5051/api/checklists/tasks"],
    ]);
    service.getLinks().subscribe((anonyousLinks: Map<string, string>) =>{
      service.getLinks().subscribe((userLinks: Map<string, string>) => {
        service.getLinks().subscribe((cachedLinks: Map<string, string>) => {
          expect(cachedLinks).toEqual(userLinks); 
          done();
        });
        const thirdFetch = httpTestingController.match("https://localhost:5051/api/")
        expect(thirdFetch.length).toBe(0);
      });
      const secondFetch = httpTestingController.match("https://localhost:5051/api/")
      expect(secondFetch.length).toBe(2);
      secondFetch.forEach((r: TestRequest) => {
        r.flush(userLinks);
      });
    })
    const firstFetch = httpTestingController.match("https://localhost:5051/api/")
    expect(firstFetch.length).toBe(2);
    firstFetch.forEach((r: TestRequest) => {
      r.flush(anonymousLinks);
    });
  }));

});
