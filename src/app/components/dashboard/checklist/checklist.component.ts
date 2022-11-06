import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { ChecklistEntity } from 'src/app/services/checklists/checklists.service';
import { TaskEntity, TasksService, Task } from 'src/app/services/tasks/tasks.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
})
export class ChecklistComponent {
  @Input() public tasks: TaskEntity[] = [];
  @Input() public title = '';
  @Input() public checklist?: ChecklistEntity;

  constructor(private taskService: TasksService, private router: Router) {}

  public get tasksSortedByEndDate() {
    return this.tasks.sort((t1, t2) => {
      const t1Date: number = t1.endDate ? DateTime.fromISO(t1.endDate).toMillis() : Number.MAX_VALUE;
      const t2Date: number = t2.endDate ? DateTime.fromISO(t2.endDate).toMillis() : Number.MAX_VALUE;
      return t1Date - t2Date;
    });
  }

  public navigateToTaskDetails(task: TaskEntity) {
    this.router.navigateByUrl('/task-details', { state: task });
  }

  public navigateToChecklist() {
    this.router.navigateByUrl('/edit-checklist', { state: this.checklist });
  }

  public async toggleDone(task: TaskEntity) {
    //TODO: Add method to TaskEntity to get task from it
    task.isDone = !task.isDone;
    const updatedTask: Task = {
      name: task.name,
      description: task.description,
      startDate: DateTime.fromISO(task.startDate),
      endDate: task.endDate ? DateTime.fromISO(task.endDate) : null,
      isDone: task.isDone,
    };
    await this.taskService.updateTask(updatedTask, task._links);
  }

  public isDueSoon(task: TaskEntity) {
    if (!task.endDate) {
      return false;
    }
    const date = DateTime.fromISO(task.endDate);
    return date.diffNow('days').days <= 3;
  }

  public isDue(task: TaskEntity) {
    if (!task.endDate) {
      return false;
    }
    const date = DateTime.fromISO(task.endDate);
    return date.diffNow('days').days <= 0;
  }
}
