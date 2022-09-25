import { Component, OnInit } from '@angular/core';
import { Checklist, ChecklistsService } from 'src/app/services/checklists/checklists.service';
import { TaskEntity, TasksService } from 'src/app/services/tasks/tasks.service';

@Component({
  selector: 'app-new-checklist',
  templateUrl: './new-checklist.component.html',
  styleUrls: ['./new-checklist.component.scss'],
})
export class NewChecklistComponent implements OnInit{
  private _newChecklist: Checklist = { name: '' };
  private _tasks: TaskEntity[] = [];

  constructor(private checklistService: ChecklistsService, private tasksService: TasksService) {}

  async ngOnInit() {
    this._tasks = await this.tasksService.getTasks();
  }

  public get newChecklist() {
    return this._newChecklist;
  }

  public get tasks() {
    return this._tasks;
  }

  public async submit() {
    await this.checklistService.createChecklist(this.newChecklist);
  }
}
