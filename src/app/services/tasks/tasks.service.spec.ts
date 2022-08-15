import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HateoasCollection } from '../links/Entity';
import { LinksService, RootLinks } from '../links/links.service';

import { TaskCollectionLinks, TaskEntity, Tasks, TasksService } from './tasks.service';

describe('TasksService', () => {
  const API_BASE_URI = 'https://todoapi.com';

  let service: TasksService;
  let httpTestingController: HttpTestingController;
  let linkService: jasmine.SpyObj<LinksService>;

  beforeEach(() => {
    const linkServiceSpy = jasmine.createSpyObj('LinksService', ['getLinks']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TasksService, { provide: LinksService, useValue: linkServiceSpy }],
    });
    service = TestBed.inject(TasksService);
    httpTestingController = TestBed.inject(HttpTestingController);
    linkService = TestBed.inject(LinksService) as jasmine.SpyObj<LinksService>;
    const links: RootLinks = {
      tasks: { href: `${API_BASE_URI}/tasks` },
      checklists: { href: '' },
      relations: { href: '' },
    };
    linkService.getLinks.and.returnValue(Promise.resolve(links));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all tasks for user', async () => {
    const expectedTasks: TaskEntity[] = [
      {
        id: 1,
        name: 'FirstTask',
        description: 'My First Task',
        startDate: '2022-08-15',
        endDate: '2022-08-15',
        isDone: false,
        _links: {
          self: {
            href: `${API_BASE_URI}/api/tasks/1`,
          },
          tasks: {
            href: `${API_BASE_URI}/api/tasks`,
          },
        },
      },
      {
        id: 2,
        name: 'SecondTask',
        description: 'My Second Task',
        startDate: '2022-08-15',
        endDate: '2022-08-15',
        isDone: false,
        _links: {
          self: {
            href: `${API_BASE_URI}/api/tasks/2`,
          },
          tasks: {
            href: `${API_BASE_URI}/api/tasks`,
          },
        },
      },
    ];
    const response: HateoasCollection<Tasks, TaskCollectionLinks> = {
      _embedded: {
        tasks: expectedTasks,
      },
      _links: {
        self: {
          href: `${API_BASE_URI}/api/tasks`,
        },
      },
    };
    const tasks = service.getTasks();
    await WaitForRequest();
    const request = httpTestingController.expectOne(`${API_BASE_URI}/tasks`);
    request.flush(response);
    expect(await tasks).toEqual(expectedTasks);
    expect(linkService.getLinks).toHaveBeenCalled();
  });

  async function WaitForRequest() {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
});
