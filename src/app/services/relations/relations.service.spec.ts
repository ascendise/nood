import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ChecklistEntity } from '../checklists/checklists.service';
import { LinksService, RootLinks } from '../links/links.service';
import { TaskLinks } from '../tasks/tasks.service';

import { Relation, RelationsService } from './relations.service';

describe('RelationsService', () => {
  const API_BASE_URI = 'https://todoapi.com';

  let service: RelationsService;
  let linkService: jasmine.SpyObj<LinksService>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    const linkServiceSpy = jasmine.createSpyObj('LinksService', ['getLinks']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RelationsService, { provide: LinksService, useValue: linkServiceSpy }],
    });
    service = TestBed.inject(RelationsService);
    linkService = TestBed.inject(LinksService) as jasmine.SpyObj<LinksService>;
    httpTestingController = TestBed.inject(HttpTestingController);
    const links: RootLinks = {
      tasks: { href: '' },
      checklists: { href: '' },
      relations: { href: `${API_BASE_URI}/checklists/tasks` },
    };
    linkServiceSpy.getLinks.and.returnValue(Promise.resolve(links));
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send request to add task to checklist', async () => {
    const relation: Relation = {
      taskId: 123,
      checklistId: 456,
    };
    const checklist = service.addTaskToChecklist(relation);
    await waitForRequest();
    const request = httpTestingController.expectOne(`${API_BASE_URI}/checklists/tasks`);
    expect(request.request.method).toEqual('PUT');
    expect(request.request.body).toEqual(relation);
    const response: ChecklistEntity = {
      id: 456,
      name: 'Some checklist',
      tasks: [
        {
          id: 123,
          name: 'Some task',
          description: 'Do something',
          startDate: '2099-01-01',
          endDate: null,
          isDone: false,
          _links: {
            self: { href: `${API_BASE_URI}/tasks/123` },
            tasks: { href: `${API_BASE_URI}/tasks` },
            removeTask: { href: `${API_BASE_URI}/checklists/456/tasks/123` },
          },
        },
      ],
      _links: {
        self: { href: `${API_BASE_URI}/checklists/1` },
        checklists: { href: `${API_BASE_URI}/checklists` },
        relations: { href: `${API_BASE_URI}/checklists/tasks` },
      },
    };
    request.flush(response);
    expect(await checklist).toEqual(response);
    expect(linkService.getLinks).toHaveBeenCalled();
  });

  async function waitForRequest() {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  it('should send request to remove task from checklist', async () => {
    const link: TaskLinks = {
      self: { href: '' },
      tasks: { href: '' },
      removeTask: { href: `${API_BASE_URI}/checklists/456/tasks/123` },
    };
    const deleteRequest = service.removeTaskFromChecklist(link);
    await waitForRequest();
    const request = httpTestingController.expectOne(`${API_BASE_URI}/checklists/456/tasks/123`);
    expect(request.request.method).toEqual('DELETE');
    const response = {
      id: 456,
      name: 'Checklist',
      tasks: [],
    };
    request.flush(response, { status: 200, statusText: 'OK' });
    await deleteRequest;
  });

  it('should ignore call if task has no link for removing from checklist', async () => {
    const link: TaskLinks = {
      self: { href: '' },
      tasks: { href: '' },
      removeTask: null,
    };
    const deleteRequest = service.removeTaskFromChecklist(link);
    await waitForRequest();
    httpTestingController.verify();
    await deleteRequest;
  });
});
