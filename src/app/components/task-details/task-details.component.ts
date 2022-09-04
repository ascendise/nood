import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskEntity } from 'src/app/services/tasks/tasks.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit{

  _task: TaskEntity

  constructor(private router: Router) {
    this._task = this.router.getCurrentNavigation()?.extras.state as TaskEntity;
  }

  ngOnInit(): void {
    if(!this._task) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  public get task(): TaskEntity {
    return this._task;
  }

}
