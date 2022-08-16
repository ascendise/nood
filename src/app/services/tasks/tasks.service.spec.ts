import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EntityNotFoundError } from '../errors';
import { HateoasCollection } from '../links/entity';
import { LinksService, RootLinks } from '../links/links.service';

import { TaskCollectionLinks, TaskEntity, TaskLinks, Tasks, TasksService, Task } from './tasks.service';

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
        done: false,
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
        done: false,
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

  it('should return empty list of tasks if no tasks were created yet', async () => {
    const expectedTasks: TaskEntity[] = [];
    const response: HateoasCollection<Tasks, TaskCollectionLinks> = {
      _embedded: null,
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

  it('should return task with given id', async () => {
    const expectedTask: TaskEntity = {
      id: 1,
      name: 'FirstTask',
      description: 'My First Task',
      startDate: '2022-08-15',
      endDate: '2022-08-15',
      done: false,
      _links: {
        self: {
          href: `${API_BASE_URI}/api/tasks/1`,
        },
        tasks: {
          href: `${API_BASE_URI}/api/tasks`,
        },
      },
    };
    const taskLink: TaskLinks = {
      self: { href: `${API_BASE_URI}/api/tasks/1` },
      tasks: { href: `${API_BASE_URI}/api/tasks` },
    };
    const taskRequest = service.getTask(taskLink);
    await WaitForRequest();
    const request = httpTestingController.expectOne(taskLink.self.href);
    request.flush(expectedTask);
    expect(await taskRequest).toEqual(expectedTask);
  });

  it('should throw error if requested task entity does not exist', async () => {
    const taskLink: TaskLinks = {
      self: { href: `${API_BASE_URI}/api/tasks/1` },
      tasks: { href: `${API_BASE_URI}/api/tasks` },
    };
    try {
      const taskRequest = service.getTask(taskLink);
      await WaitForRequest();
      const request = httpTestingController.expectOne(taskLink.self.href);
      request.flush('', { status: 404, statusText: 'Not Found' });
      await taskRequest;
      fail('Method did not throw error');
    } catch (err) {
      expect(err).toEqual(new EntityNotFoundError());
    }
  });

  it('should send task to api and return created resource', async () => {
    const newTask: Task = {
      name: 'My new task',
      description: 'This is my new task',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-02'),
      done: false,
    };
    const expectedResponse: TaskEntity = {
      id: 123,
      name: 'My new task',
      description: 'This is my new task',
      startDate: '2023-01-01',
      endDate: '2023-01-02',
      done: false,
      _links: {
        self: { href: `${API_BASE_URI}/api/tasks/1` },
        tasks: { href: `${API_BASE_URI}/api/tasks` },
      },
    };
    const taskRequest = service.createTask(newTask);
    await WaitForRequest();
    const request = httpTestingController.expectOne(`${API_BASE_URI}/tasks`);
    request.flush(expectedResponse, { status: 201, statusText: 'Created' });
    expect(await taskRequest).toEqual(expectedResponse);
    expect(linkService.getLinks).toHaveBeenCalled();
  });

  it('should format provided task to format expected by API', async () => {
    const newTask: Task = {
      name: 'My new task',
      description: 'This is my new task',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-21'),
      done: false,
    };
    const taskRequest = service.createTask(newTask);
    await WaitForRequest();
    const request = httpTestingController.expectOne(`${API_BASE_URI}/tasks`);
    expect(request.request.body.startDate).toEqual('2023-01-01');
    expect(request.request.body.endDate).toEqual('2023-01-21');
    request.flush('');
    await taskRequest;
  });
});
