import { TestBed } from '@angular/core/testing';
import { LinksService } from './links.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

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
    var request = httpTestingController.expectOne("https://localhost:5051/api/")
    request.flush(expectedLinks);
  });
});
