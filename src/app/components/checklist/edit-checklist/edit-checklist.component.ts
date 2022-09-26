import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Checklist, ChecklistEntity, ChecklistsService } from 'src/app/services/checklists/checklists.service';
import { Relation, RelationsService } from 'src/app/services/relations/relations.service';
import { TaskEntity, TasksService } from 'src/app/services/tasks/tasks.service';
import { SelectListComponent } from '../../select-list/select-list.component';
import { SelectOptionComponent } from '../../select-list/select-option/select-option.component';

@Component({
  selector: 'app-edit-checklist',
  templateUrl: './edit-checklist.component.html',
  styleUrls: ['./edit-checklist.component.scss']
})
export class EditChecklistComponent implements OnInit{

  private _checklist: ChecklistEntity;
  private _tasks: TaskEntity[] = [];
  @ViewChild('taskList') taskList!: SelectListComponent<TaskEntity>;

  constructor(private router: Router,
    private taskService: TasksService,
    private checklistService: ChecklistsService,
    private relationService: RelationsService,) {
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
    //TODO: Add again after editing checklists via API won't remove all tasks from checklist
    //PS: The API Dev is a f*cking idiot
    // const checklist: Checklist = {
    //   name: this._checklist.name,
    // };
    // await this.checklistService.updateChecklist(checklist, this._checklist._links);
    await this.updateRelations();
  }

  private async updateRelations() {
    for (const option of this.taskList.changedOptions) {
      if (option.isSelected) {
        console.log("Add", option.item)
        await this.addTaskToChecklist(option.item);
      } else {
        console.log("Remove", option.item)
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
    return this.checklist.tasks.some((t) => t.id === task.id)
  }
}
