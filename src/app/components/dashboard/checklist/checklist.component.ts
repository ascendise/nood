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
      if (!t1.endDate) return 1;
      if (!t2.endDate) return -1;
      return new Date(t1.endDate).getTime() - new Date(t2.endDate).getTime();
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
