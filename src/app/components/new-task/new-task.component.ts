import { Component } from '@angular/core';
import { Task } from 'src/app/services/tasks/tasks.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent {

  private newTask: Task = {
    name: '',
    description: '',
    startDate: new Date(),
    endDate: null,
    done: false
  }

  public get NewTask() {
    return this.newTask;
  }

}
