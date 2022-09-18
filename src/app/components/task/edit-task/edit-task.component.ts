import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Task, TaskEntity, TasksService } from 'src/app/services/tasks/tasks.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent {
  _task: TaskEntity;

  constructor(private router: Router, private tasksService: TasksService) {
    this._task = router.getCurrentNavigation()?.extras.state as TaskEntity;
  }

  public get task(): TaskEntity {
    return this._task;
  }

  public async submit() {
    const taskDto: Task = {
      name: this._task.name,
      description: this._task.description,
      startDate: new Date(this._task.startDate),
      endDate: this._task.endDate != null ? new Date(this._task.endDate) : null,
      isDone: this._task.isDone,
    };
    await this.tasksService.updateTask(taskDto, this._task._links);
    this.router.navigateByUrl('/dashboard');
  }
}
