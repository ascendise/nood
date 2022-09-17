import { Component } from '@angular/core';
import { Checklist, ChecklistsService } from 'src/app/services/checklists/checklists.service';

@Component({
  selector: 'app-new-checklist',
  templateUrl: './new-checklist.component.html',
  styleUrls: ['./new-checklist.component.scss'],
})
export class NewChecklistComponent {
  private _newChecklist: Checklist = { name: '' };

  constructor(private checklistService: ChecklistsService) {}

  public get newChecklist() {
    return this._newChecklist;
  }

  public async submit() {
    await this.checklistService.createChecklist(this.newChecklist);
  }
}
