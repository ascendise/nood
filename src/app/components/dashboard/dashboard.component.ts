import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChecklistEntity, ChecklistsService } from 'src/app/services/checklists/checklists.service';
import { TaskEntity, TasksService } from 'src/app/services/tasks/tasks.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private _tasks: TaskEntity[] = [];
  private _checklists: ChecklistEntity[] = [];

  constructor(
    private tasksService: TasksService,
    private checklistsService: ChecklistsService,
    private router: Router
  ) {}

  async ngOnInit() {
    this._tasks = await this.tasksService.getTasks();
    this._checklists = await this.checklistsService.getChecklists();
    this.mapSameReference();
  }

  private mapSameReference() {
    this._checklists.map(c => {
      for (let i = 0; i < c.tasks.length; i++) {
        const task = this._tasks.find(t => t.id === c.tasks[i].id);
        if (!task) {
          throw Error("Checklist has unknown task");
        }
        c.tasks[i] = task;
      }
    });
  }

  public get tasks(): TaskEntity[] {
    return this._tasks;
  }

  public get checklists(): ChecklistEntity[] {
    return this._checklists;
  }

  public getUniqueName(checklist: ChecklistEntity) {
    if (this.hasUniqueName(checklist)) {
      return checklist.name;
    }
    return `${checklist.name}#${checklist.id}`;
  }

  private hasUniqueName(checklist: ChecklistEntity) {
    return this.checklists.filter((c) => c.name.trim() === checklist.name.trim()).length <= 1;
  }
}
