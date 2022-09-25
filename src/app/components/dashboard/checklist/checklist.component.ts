import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ChecklistEntity } from 'src/app/services/checklists/checklists.service';
import { TaskEntity } from 'src/app/services/tasks/tasks.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent {

  @Input() public tasks: TaskEntity[] = [];
  @Input() public title = '';
  @Input() public checklist?: ChecklistEntity;

  constructor(private router: Router) {}

  public navigateToTaskDetails(task: TaskEntity) {
    this.router.navigateByUrl('/task-details', { state: task });
  }

  public navigateToChecklist() {
    this.router.navigateByUrl('/edit-checklist', {state: this.checklist})
  }
}
