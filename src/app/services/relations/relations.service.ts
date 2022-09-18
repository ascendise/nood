import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ChecklistEntity } from '../checklists/checklists.service';
import { LinksService } from '../links/links.service';

@Injectable({
  providedIn: 'root'
})
export class RelationsService {

  constructor(private linksService: LinksService, private httpClient: HttpClient) { }

  public async addTaskToChecklist(relation: Relation) : Promise<ChecklistEntity> {
    const links = await this.linksService.getLinks();
    const updatedChecklist = this.httpClient.put<ChecklistEntity>(links.relations.href, relation);
    return await firstValueFrom(updatedChecklist);
  }
}

export interface Relation {
  taskId: number,
  checklistId: number,
}
