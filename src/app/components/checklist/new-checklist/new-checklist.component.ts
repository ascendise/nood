import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Checklist, ChecklistsService } from 'src/app/services/checklists/checklists.service';
import { Relation, RelationsService } from 'src/app/services/relations/relations.service';
import { TaskEntity, TasksService } from 'src/app/services/tasks/tasks.service';
import { SelectListComponent } from '../../select-list/select-list.component';

@Component({
  selector: 'app-new-checklist',
  templateUrl: './new-checklist.component.html',
  styleUrls: ['./new-checklist.component.scss'],
})
export class NewChecklistComponent implements OnInit {
  private _tasks: TaskEntity[] = [];
  @ViewChild('taskList') private _taskList?: SelectListComponent<TaskEntity>;
  private _newChecklistForm: FormGroup;

  constructor(
    private checklistService: ChecklistsService,
    private tasksService: TasksService,
    private relationService: RelationsService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this._newChecklistForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^(?!\\s*$).+')]],
    });
  }

  async ngOnInit() {
    this._tasks = await this.tasksService.getTasks();
  }

  public get tasks() {
    return this._tasks;
  }

  public get newChecklistForm() {
    return this._newChecklistForm;
  }

  public async submit() {
    const newChecklist = this.newChecklistForm.value as Checklist;
    const checklist = await this.checklistService.createChecklist(newChecklist);
    this._taskList?.selectedItems.forEach(async (t) => {
      const relation: Relation = {
        taskId: t.id,
        checklistId: checklist.id,
      };
      await this.relationService.addTaskToChecklist(relation);
    });
    this.router.navigateByUrl('dashboard');
  }
}
