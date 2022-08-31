import { Component } from '@angular/core';
import { Task, TasksService } from 'src/app/services/tasks/tasks.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent {

  private _newTask: Task = {
    name: '',
    description: '',
    startDate: new Date(),
    endDate: null,
    done: false
  }

  constructor(private tasksService: TasksService) {}

  public get newTask() {
    return this._newTask;
  }

  public submit() {
    this.tasksService.createTask(this.newTask)
  }

}
