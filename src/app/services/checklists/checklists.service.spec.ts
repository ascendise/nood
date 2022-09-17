import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LinksService, RootLinks } from '../links/links.service';

import { Checklist, ChecklistEntity, ChecklistsService } from './checklists.service';

describe('ChecklistsService', () => {
  const API_BASE_URI = 'https://todoapi.com';

  let service: ChecklistsService;
  let linksService: jasmine.SpyObj<LinksService>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    const linkServiceSpy = jasmine.createSpyObj('LinksService', ['getLinks']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChecklistsService, {provide: LinksService, useValue: linkServiceSpy}],
    });
    service = TestBed.inject(ChecklistsService);
    linksService = TestBed.inject(LinksService) as jasmine.SpyObj<LinksService>;
    httpTestingController = TestBed.inject(HttpTestingController);
    const links: RootLinks = {
      tasks: { href: '' },
      checklists: { href: `${API_BASE_URI}/checklists` },
      relations: { href: '' },
    };
    linkServiceSpy.getLinks.and.returnValue(Promise.resolve(links))
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send request to create checklist', async () => {
    const newChecklist: Checklist = {
      name: 'My awesome new checklist',
    };
    const expectedResponse: ChecklistEntity = {
      id: 1,
      name: 'My awesome new checklist',
      tasks: [],
      _links: {
        self: {
          href: `${API_BASE_URI}/checklists/1`,
        },
        checklists: {
          href: `${API_BASE_URI}/checklists`,
        },
        relations: {
          href: `${API_BASE_URI}/checklists/tasks`,
        },
      },
    };
    const checklist = service.createChecklist(newChecklist);
    await waitForRequest();
    const request = httpTestingController.expectOne(`${API_BASE_URI}/checklists`);
    expect(request.request.method).toEqual('POST');
    expect(request.request.body).toEqual(newChecklist);
    request.flush(expectedResponse);
    expect(await checklist).toEqual(expectedResponse);
    expect(linksService.getLinks).toHaveBeenCalled();
  })

  async function waitForRequest() {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  it('should return all available checklists', async () => {
    const checklists = service.getChecklists();
    await waitForRequest();
    const request = httpTestingController.expectOne(`${API_BASE_URI}/checklists`);
    expect(request.request.method).toEqual('GET');
    const expectedResponse: ChecklistEntity[] = [
      {
        id: 1,
        name: 'My awesome new checklist',
        tasks: [],
        _links: {
          self: { href: `${API_BASE_URI}/checklists/1`, },
          checklists: { href: `${API_BASE_URI}/checklists`, },
          relations: { href: `${API_BASE_URI}/checklists/tasks`, },
        },
      },
      {
        id: 2,
        name: 'Another checklist',
        tasks: [],
        _links: {
          self: { href: `${API_BASE_URI}/checklists/2`, },
          checklists: { href: `${API_BASE_URI}/checklists`, },
          relations: { href: `${API_BASE_URI}/checklists/tasks`, },
        },
      },
    ]
    request.flush(expectedResponse);
    expect(await checklists).toEqual(expectedResponse);
    expect(linksService.getLinks).toHaveBeenCalled();
  })

});
