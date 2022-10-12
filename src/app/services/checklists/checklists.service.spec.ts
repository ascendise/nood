import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EntityNotFoundError } from '../errors';
import { HateoasCollection } from '../links/entity';
import { LinksService, RootLinks } from '../links/links.service';

import {
  Checklist,
  ChecklistCollectionLinks,
  ChecklistEntity,
  ChecklistLinks,
  Checklists,
  ChecklistsService,
} from './checklists.service';

describe('ChecklistsService', () => {
  const API_BASE_URI = 'https://todoapi.com';

  let service: ChecklistsService;
  let linksService: jasmine.SpyObj<LinksService>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    const linkServiceSpy = jasmine.createSpyObj('LinksService', ['getLinks']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChecklistsService, { provide: LinksService, useValue: linkServiceSpy }],
    });
    service = TestBed.inject(ChecklistsService);
    linksService = TestBed.inject(LinksService) as jasmine.SpyObj<LinksService>;
    httpTestingController = TestBed.inject(HttpTestingController);
    const links: RootLinks = {
      tasks: { href: '' },
      checklists: { href: `${API_BASE_URI}/checklists` },
      relations: { href: '' },
      user: { href: '' },
    };
    linkServiceSpy.getLinks.and.returnValue(Promise.resolve(links));
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
  });

  async function waitForRequest() {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  it('should return all available checklists', async () => {
    const checklists = service.getChecklists();
    await waitForRequest();
    const request = httpTestingController.expectOne(`${API_BASE_URI}/checklists`);
    expect(request.request.method).toEqual('GET');
    const expectedChecklists: ChecklistEntity[] = [
      {
        id: 1,
        name: 'My awesome new checklist',
        tasks: [],
        _links: {
          self: { href: `${API_BASE_URI}/checklists/1` },
          checklists: { href: `${API_BASE_URI}/checklists` },
          relations: { href: `${API_BASE_URI}/checklists/tasks` },
        },
      },
      {
        id: 2,
        name: 'Another checklist',
        tasks: [],
        _links: {
          self: { href: `${API_BASE_URI}/checklists/2` },
          checklists: { href: `${API_BASE_URI}/checklists` },
          relations: { href: `${API_BASE_URI}/checklists/tasks` },
        },
      },
    ];
    const expectedResponse: HateoasCollection<Checklists, ChecklistCollectionLinks> = {
      _embedded: {
        checklists: expectedChecklists,
      },
      _links: {
        self: {
          href: `${API_BASE_URI}/api/tasks`,
        },
        relations: {
          href: `${API_BASE_URI}/api/checklists/tasks`,
        },
      },
    };
    request.flush(expectedResponse);
    expect(await checklists).toEqual(expectedChecklists);
    expect(linksService.getLinks).toHaveBeenCalled();
  });

  it('should return empty array if there are no checklists', async () => {
    const checklists = service.getChecklists();
    await waitForRequest();
    const request = httpTestingController.expectOne(`${API_BASE_URI}/checklists`);
    expect(request.request.method).toEqual('GET');
    const expectedResponse: HateoasCollection<Checklists, ChecklistCollectionLinks> = {
      _embedded: null,
      _links: {
        self: {
          href: `${API_BASE_URI}/api/tasks`,
        },
        relations: {
          href: `${API_BASE_URI}/api/checklists/tasks`,
        },
      },
    };
    request.flush(expectedResponse);
    expect(await checklists).toEqual([]);
    expect(linksService.getLinks).toHaveBeenCalled();
  });

  it('should return specified checklist', async () => {
    const checklistLink: ChecklistLinks = {
      self: { href: `${API_BASE_URI}/checklists/123` },
      checklists: { href: `${API_BASE_URI}/checklists` },
      relations: { href: `${API_BASE_URI}/checklists/tasks` },
    };
    const checklist = service.getChecklist(checklistLink);
    await waitForRequest();
    const request = httpTestingController.expectOne(`${API_BASE_URI}/checklists/123`);
    expect(request.request.method).toEqual('GET');
    const expectedResponse: ChecklistEntity = {
      id: 123,
      name: 'Shopping list',
      tasks: [],
      _links: {
        self: { href: `${API_BASE_URI}/checklists/123` },
        checklists: { href: `${API_BASE_URI}/checklists` },
        relations: { href: `${API_BASE_URI}/checklists/tasks` },
      },
    };
    request.flush(expectedResponse);
    expect(await checklist).toEqual(expectedResponse);
  });

  it('should return EntityNotFoundException if checklist does not exist', async () => {
    const checklistLink: ChecklistLinks = {
      self: { href: `${API_BASE_URI}/checklists/999` },
      checklists: { href: `${API_BASE_URI}/checklists` },
      relations: { href: `${API_BASE_URI}/checklists/tasks` },
    };
    try {
      const checklist = service.getChecklist(checklistLink);
      await waitForRequest();
      const request = httpTestingController.expectOne(`${API_BASE_URI}/checklists/999`);
      request.flush('', { status: 404, statusText: 'Not Found' });
      await checklist;
      fail('Expected to throw EntityNotFoundError');
    } catch (err) {
      expect(err).toEqual(new EntityNotFoundError());
    }
  });

  it('should throw errors that are not EntityNotFoundException if one occurs on getting specific checklist', async () => {
    const checklistLink: ChecklistLinks = {
      self: { href: `${API_BASE_URI}/checklists/999` },
      checklists: { href: `${API_BASE_URI}/checklists` },
      relations: { href: `${API_BASE_URI}/checklists/tasks` },
    };
    try {
      const checklist = service.getChecklist(checklistLink);
      await waitForRequest();
      const request = httpTestingController.expectOne(`${API_BASE_URI}/checklists/999`);
      request.flush('', { status: 503, statusText: 'Service Unavailable' });
      await checklist;
      fail('Expected to throw HttpException');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpErrorResponse);
    }
  });

  it('should send request to update checklist', async () => {
    const checklistLink: ChecklistLinks = {
      self: { href: `${API_BASE_URI}/checklists/420` },
      checklists: { href: `${API_BASE_URI}/checklists` },
      relations: { href: `${API_BASE_URI}/checklists/tasks` },
    };
    const updatedChecklist: Checklist = {
      name: 'Updated Checklist name',
    };
    const checklist = service.updateChecklist(updatedChecklist, checklistLink);
    await waitForRequest();
    const request = httpTestingController.expectOne(`${API_BASE_URI}/checklists/420`);
    expect(request.request.method).toEqual('PUT');
    expect(request.request.body).toEqual(updatedChecklist);
    const expectedResponse: ChecklistEntity = {
      id: 420,
      name: 'Updated Checklist name',
      tasks: [],
      _links: {
        self: { href: `${API_BASE_URI}/checklists/420` },
        checklists: { href: `${API_BASE_URI}/checklists` },
        relations: { href: `${API_BASE_URI}/checklists/tasks` },
      },
    };
    request.flush(expectedResponse);
    expect(await checklist).toEqual(expectedResponse);
  });

  it('should send request to delete checklist', async () => {
    const checklistLink: ChecklistLinks = {
      self: { href: `${API_BASE_URI}/checklists/9001` },
      checklists: { href: `${API_BASE_URI}/checklists` },
      relations: { href: `${API_BASE_URI}/checklists/tasks` },
    };
    const deleteRequest = service.deleteChecklist(checklistLink);
    await waitForRequest();
    const request = httpTestingController.expectOne(`${API_BASE_URI}/checklists/9001`);
    expect(request.request.method).toEqual('DELETE');
    request.flush('', { status: 204, statusText: 'No Content' });
    await deleteRequest;
  });
});
