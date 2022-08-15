import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HateoasCollection, HateoasEntity } from '../links/Entity';
import { Link } from '../links/links';
import { LinksService, RootLinks } from '../links/links.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private linksService: LinksService, private http: HttpClient) {}

  public async getTasks(): Promise<TaskEntity[]> {
    const links = (await this.linksService.getLinks()) as RootLinks;
    const request = this.http.get<HateoasCollection<Tasks, TaskCollectionLinks>>(links.tasks.href);
    const taskResponse = await firstValueFrom(request);
    return taskResponse._embedded.tasks;
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
  isDone: boolean;
}

export interface TaskLinks {
  self: Link;
  tasks: Link;
}

export interface TaskCollectionLinks {
  self: Link;
}
