import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  @Input() title = 'Form';
  @Input() submitButtonText = 'Submit';
  @Input() formGroup!: FormGroup;

  @Output() onSubmit = new EventEmitter();
}
