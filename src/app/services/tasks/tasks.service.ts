import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EntityNotFoundError } from '../errors';
import { HateoasCollection, HateoasEntity } from '../links/entity';
import { Link } from '../links/links';
import { LinksService, RootLinks } from '../links/links.service';

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
    const link = await this.getTasksLink();
    const request = this.http.post<TaskEntity>(link, task);
    const taskResponse = await firstValueFrom(request);
    return taskResponse;
  }
}

export interface Tasks {
  tasks: TaskEntity[];
}

export interface TaskEntity extends HateoasEntity<TaskLinks> {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  done: boolean;
}

export interface Task {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  done: boolean;
}

export interface TaskLinks {
  self: Link;
  tasks: Link;
}

export interface TaskCollectionLinks {
  self: Link;
}
