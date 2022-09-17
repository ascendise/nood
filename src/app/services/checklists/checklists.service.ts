import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EntityNotFoundError } from '../errors';
import { HateoasEntity } from '../links/entity';
import { Link } from '../links/links';
import { LinksService } from '../links/links.service';
import { TaskEntity } from '../tasks/tasks.service';

@Injectable({
  providedIn: 'root'
})
export class ChecklistsService {

  public constructor(private httpClient: HttpClient, private linksService: LinksService) {}

  public async getChecklists(): Promise<ChecklistEntity[]> {
    const links = await this.linksService.getLinks();
    const request = this.httpClient.get<ChecklistEntity[]>(links.checklists.href);
    return await firstValueFrom(request);
  }

  public async getChecklist(checklistLink: ChecklistLinks): Promise<ChecklistEntity> {
    const request = this.httpClient.get<ChecklistEntity>(checklistLink.self.href)
    return await firstValueFrom(request).catch((err: HttpErrorResponse) => {
      if (err.status === 404) {
        throw new EntityNotFoundError();
      }
      throw err;
    });
  }

  public async createChecklist(checklist: Checklist): Promise<ChecklistEntity> {
    const links = await this.linksService.getLinks();
    const request = this.httpClient.post<ChecklistEntity>(links.checklists.href, checklist);
    return await firstValueFrom(request);
  }

  public async updateChecklist(checklist: Checklist, link: ChecklistLinks): Promise<ChecklistEntity> {
    const request = this.httpClient.put<ChecklistEntity>(link.self.href, checklist);
    return await firstValueFrom(request);
  }

  public async deleteChecklist(link: ChecklistLinks) {
    const request = this.httpClient.delete(link.self.href);
    return await firstValueFrom(request);
  }
}

export interface Checklist {
  name: string,
}

export interface ChecklistEntity extends HateoasEntity<ChecklistLinks> {
  id: number,
  name: string,
  tasks: TaskEntity[],
}

export interface ChecklistLinks {
  self: Link,
  checklists: Link,
  relations: Link,
}
