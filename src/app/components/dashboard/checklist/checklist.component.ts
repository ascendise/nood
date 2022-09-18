import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TaskEntity } from 'src/app/services/tasks/tasks.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent {

  @Input() public tasks: TaskEntity[] = [];
  @Input() public title = '';

  constructor(private router: Router) {}

  public navigateToTaskDetails(task: TaskEntity) {
    this.router.navigateByUrl('/task-details', { state: task });
  }
}
