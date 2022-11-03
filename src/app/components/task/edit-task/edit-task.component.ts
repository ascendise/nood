import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { Task, TaskEntity, TasksService } from 'src/app/services/tasks/tasks.service';
import { DateValidator } from 'src/app/validators/not-before-date/not-before-date.validator';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent {
  private _editTaskForm: FormGroup;
  private _task: TaskEntity;

  constructor(private router: Router, private formBuilder: FormBuilder, private tasksService: TasksService) {
    this._task = router.getCurrentNavigation()?.extras.state as TaskEntity;
    const emptyOrWhitespacePattern = '^(?!\\s*$).+';
    this._editTaskForm = this.formBuilder.group({
      name: [this._task.name, [Validators.required, Validators.pattern(emptyOrWhitespacePattern)]],
      description: [this._task.description],
      startDate: [this._task.startDate, [Validators.required, DateValidator.notBefore(DateTime.fromISO(this._task.startDate))]],
      endDate: [this._task.endDate],
    });
  }

  public get editTaskForm() {
    return this._editTaskForm;
  }

  public async submit() {
    const taskDto: Task = {
      name: this.editTaskForm.get('name')?.value,
      description: this.editTaskForm.get('description')?.value,
      startDate: DateTime.fromISO(this.editTaskForm.get('startDate')?.value),
      endDate: this.editTaskForm.get('endDate')?.value ? DateTime.fromISO(this.editTaskForm.get('endDate')?.value) : null,
      isDone: this.editTaskForm.get('isDone')?.value,
    };
    await this.tasksService.updateTask(taskDto, this._task._links);
    this.router.navigateByUrl('/dashboard');
  }
}
