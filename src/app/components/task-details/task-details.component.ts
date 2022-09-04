import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskEntity, TasksService } from 'src/app/services/tasks/tasks.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit{

  _task: TaskEntity

  constructor(private router: Router, private tasksService: TasksService) {
    this._task = this.router.getCurrentNavigation()?.extras.state as TaskEntity;
    if(this.isNullOrWhitespace(this._task.description)) {
      this._task.description = "(No description)";
    }
    if(this.isNullOrWhitespace(this._task.endDate)) {
      this._task.endDate = "(No end date)"
    }
  }

  isNullOrWhitespace(str: string | null): boolean {
    return str === null || str.match(/^ *$/) !== null;
  }

  ngOnInit(): void {
    if(!this._task) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  public get task(): TaskEntity {
    return this._task;
  }

  public async delete() {
    await this.tasksService.deleteTask(this._task._links);
    this.router.navigateByUrl('/dashboard');
  }

  public async navigateToEdit() {
    this.router.navigateByUrl('/edit-task', { state: this._task })
  }

}
