import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Checklist, ChecklistEntity, ChecklistsService } from 'src/app/services/checklists/checklists.service';
import { TaskEntity, TasksService } from 'src/app/services/tasks/tasks.service';

@Component({
  selector: 'app-edit-checklist',
  templateUrl: './edit-checklist.component.html',
  styleUrls: ['./edit-checklist.component.scss']
})
export class EditChecklistComponent implements OnInit{

  private _checklist: ChecklistEntity;
  private _tasks: TaskEntity[] = [];

  constructor(private router: Router,
    private taskService: TasksService,
    private checklistService: ChecklistsService) {
    this._checklist = router.getCurrentNavigation()?.extras.state as ChecklistEntity;
  }

  public get checklist() {
    return this._checklist;
  }

  public get tasks() {
    return this._tasks;
  }

  public async ngOnInit() {
    this._tasks = await this.taskService.getTasks();
  }

  public async submit() {
    const checklist: Checklist = {
      name: this._checklist.name,
    };
    await this.checklistService.updateChecklist(checklist, this._checklist._links);
  }

  public isInChecklist(task: TaskEntity) {
    return this.checklist.tasks.some((t) => t.id === task.id)
  }
}
