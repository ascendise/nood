import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { Task, TasksService } from 'src/app/services/tasks/tasks.service';
import { DateValidator } from 'src/app/validators/not-before-date/not-before-date.validator';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent {
  private _newTaskForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private tasksService: TasksService) {
    const emptyOrWhitespacePattern = '^(?!\\s*$).+';
    this._newTaskForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(emptyOrWhitespacePattern)]],
      description: [''],
      startDate: [DateTime.now(), [Validators.required, DateValidator.notBefore(DateTime.now())]],
      endDate: [null],
      isDone: [false],
    });
  }

  public get newTaskForm() {
    return this._newTaskForm;
  }

  public async submit() {
    const newTask = this.getTaskFromForm();
    await this.tasksService.createTask(newTask);
    this.router.navigateByUrl('dashboard');
  }

  private getTaskFromForm(): Task {
    const values = this.newTaskForm.value;
    return {
      name: values.name,
      description: values.description,
      startDate: DateTime.fromISO(values.startDate),
      endDate: values.endDate ? DateTime.fromISO(values.endDate) : null,
      isDone: values.isDone,
    };
  }
}
