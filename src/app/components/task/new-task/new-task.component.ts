import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Task, TasksService } from 'src/app/services/tasks/tasks.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent {
  private _newTask: Task = {
    name: '',
    description: '',
    startDate: new Date(),
    endDate: null,
    isDone: false,
  };

  constructor(private router: Router, private tasksService: TasksService) {}

  public get newTask() {
    return this._newTask;
  }

  public async submit() {
    await this.tasksService.createTask(this.newTask);
    this.router.navigateByUrl('dashboard');
  }
}
