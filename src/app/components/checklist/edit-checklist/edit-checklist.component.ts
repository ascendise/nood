import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Checklist, ChecklistEntity, ChecklistsService } from 'src/app/services/checklists/checklists.service';

@Component({
  selector: 'app-edit-checklist',
  templateUrl: './edit-checklist.component.html',
  styleUrls: ['./edit-checklist.component.scss']
})
export class EditChecklistComponent {

  private _checklist: ChecklistEntity;

  constructor(private router: Router, private checklistService: ChecklistsService) {
    this._checklist = router.getCurrentNavigation()?.extras.state as ChecklistEntity;
  }

  public get checklist() {
    return this._checklist;
  }

  public async submit() {
    const checklist: Checklist = {
      name: this._checklist.name,
    };
    await this.checklistService.updateChecklist(checklist, this._checklist._links);
  }
}
