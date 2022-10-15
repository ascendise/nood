import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChecklistEntity, ChecklistsService } from 'src/app/services/checklists/checklists.service';
import { Relation, RelationsService } from 'src/app/services/relations/relations.service';
import { TaskEntity, TasksService } from 'src/app/services/tasks/tasks.service';
import { SelectListComponent } from '../../select-list/select-list.component';

@Component({
  selector: 'app-edit-checklist',
  templateUrl: './edit-checklist.component.html',
  styleUrls: ['./edit-checklist.component.scss'],
})
export class EditChecklistComponent implements OnInit {
  private _checklist: ChecklistEntity;
  private _tasks: TaskEntity[] = [];
  @ViewChild('taskList') private taskList!: SelectListComponent<TaskEntity>;
  private _checklistForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private taskService: TasksService,
    private checklistService: ChecklistsService,
    private relationService: RelationsService
  ) {
    this._checklist = router.getCurrentNavigation()?.extras.state as ChecklistEntity;
    this._checklistForm = this.formBuilder.group({
      name: [
        this._checklist.name,
        [
          Validators.required,
          Validators.pattern('^(?!\\s*$).+'),
        ],
      ],
    })
  }

  public get checklist() {
    return this._checklist;
  }

  public get tasks() {
    return this._tasks;
  }

  public get checklistForm() {
    return this._checklistForm;
  }

  public async ngOnInit() {
    this._tasks = await this.taskService.getTasks();
  }

  public async submit() {
    this._checklist.name = this._checklistForm.get('name')?.value
    //TODO: Add again after editing checklists via API won't remove all tasks from checklist
    //PS: The API Dev is a f*cking idiot
    // const checklist: Checklist = {
    //   name: this._checklist.name,
    // };
    // await this.checklistService.updateChecklist(checklist, this._checklist._links);
    await this.updateRelations();
    this.router.navigateByUrl('dashboard');
  }

  private async updateRelations() {
    for (const option of this.taskList.changedOptions) {
      if (option.isSelected) {
        await this.addTaskToChecklist(option.item);
      } else {
        await this.removeTaskFromChecklist(option.item);
      }
    }
  }

  private async addTaskToChecklist(task: TaskEntity) {
    const relation: Relation = {
      taskId: task.id,
      checklistId: this._checklist.id,
    };
    await this.relationService.addTaskToChecklist(relation);
  }

  private async removeTaskFromChecklist(task: TaskEntity) {
    const taskFromChecklist = this.checklist.tasks.find((t) => t.id === task.id);
    if (taskFromChecklist) {
      await this.relationService.removeTaskFromChecklist(taskFromChecklist._links);
    }
  }

  public isInChecklist(task: TaskEntity) {
    return this.checklist.tasks.some((t) => t.id === task.id);
  }

  public async delete() {
    await this.checklistService.deleteChecklist(this.checklist._links);
    this.router.navigateByUrl('dashboard');
  }
}
