import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EntityNotFoundError } from '../errors';
import { HateoasCollection, HateoasEntity } from '../links/entity';
import { Link } from '../links/links';
import { LinksService, RootLinks } from '../links/links.service';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private linksService: LinksService, private http: HttpClient) {}

  public async getTasks(): Promise<TaskEntity[]> {
    const taskLink = await this.getTasksLink();
    const request = this.http.get<HateoasCollection<Tasks, TaskCollectionLinks>>(taskLink);
    const taskResponse = await firstValueFrom(request);
    if (taskResponse._embedded != null) {
      return taskResponse._embedded.tasks;
    }
    return [];
  }

  private async getTasksLink(): Promise<string> {
    const links = (await this.linksService.getLinks()) as RootLinks;
    return links.tasks.href;
  }

  public async getTask(taskLink: TaskLinks): Promise<TaskEntity> {
    const request = this.http.get<TaskEntity>(taskLink.self.href);
    const taskResponse = await firstValueFrom(request).catch((err: HttpErrorResponse) => {
      if (err.status === 404) {
        throw new EntityNotFoundError();
      }
      throw err;
    });
    return taskResponse;
  }

  public async createTask(task: Task): Promise<TaskEntity> {
    const taskDto = TasksService.toTaskDto(task);
    const link = await this.getTasksLink();
    const request = this.http.post<TaskEntity>(link, taskDto);
    const taskResponse = await firstValueFrom(request);
    return taskResponse;
  }

  private static toTaskDto(task: Task): TaskDto {
    return {
      name: task.name,
      description: task.description,
      startDate: TasksService.toDateString(task.startDate),
      endDate: task.endDate != null ? TasksService.toDateString(task.endDate) : null,
      isDone: task.isDone,
    };
  }

  private static toDateString(date: DateTime) {
    return date.toFormat('yyyy-MM-dd');
  }

  public async updateTask(task: Task, link: TaskLinks): Promise<TaskEntity> {
    const taskDto = TasksService.toTaskDto(task);
    const request = this.http.put<TaskEntity>(link.self.href, taskDto);
    return await firstValueFrom(request).catch((err: HttpErrorResponse) => {
      if (err.status === 404) {
        throw new EntityNotFoundError();
      }
      throw err;
    });
  }

  public async deleteTask(link: TaskLinks) {
    await firstValueFrom(this.http.delete(link.self.href));
  }
}

interface TaskDto {
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isDone: boolean;
}

export interface Tasks {
  tasks: TaskEntity[];
}

export interface TaskEntity extends HateoasEntity<TaskLinks> {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isDone: boolean;
}

export interface Task {
  name: string;
  description: string;
  startDate: DateTime;
  endDate: DateTime | null;
  isDone: boolean;
}

export interface TaskLinks {
  self: Link;
  tasks: Link;
  removeTask: Link | null;
}

export interface TaskCollectionLinks {
  self: Link;
}
