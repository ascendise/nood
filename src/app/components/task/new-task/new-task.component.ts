import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Task, TasksService } from 'src/app/services/tasks/tasks.service';
import { NotInPastDirective } from 'src/app/validators/not-in-past/not-in-past.directive';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent {
  private _newTaskForm: FormGroup;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private tasksService: TasksService) {
      const emptyOrWhitespacePattern = '^(?!\\s*$).+';
      this._newTaskForm = this.formBuilder.group({
        name: [
          '',
          Validators.required,
          Validators.pattern(emptyOrWhitespacePattern),
        ],
        description: [''],
        startDate: [
          new Date(),
          Validators.required,
          NotInPastDirective,
        ],
        endDate: [
          null,
        ],
        isDone: [false],
      })
  }

  public get newTaskForm() {
    return this._newTaskForm;
  }

  public async submit() {
    const newTask = this.newTaskForm.value as Task
    await this.tasksService.createTask(newTask);
    this.router.navigateByUrl('dashboard');
  }
}
