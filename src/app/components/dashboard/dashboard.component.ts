import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskEntity, TasksService } from 'src/app/services/tasks/tasks.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private _tasks: TaskEntity[] = [];

  constructor(private tasksService: TasksService,private router: Router) {}

  async ngOnInit() {
    this._tasks = await this.tasksService.getTasks();
  }

  public get tasks(): TaskEntity[] {
    return this._tasks;
  }

  public navigateToTaskDetails(task: TaskEntity) {
    this.router.navigateByUrl('/task-details', { state: task });
  }

}
