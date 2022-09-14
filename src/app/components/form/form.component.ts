import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {

  @Input() title = "Form";
  @Input() submitButtonText = "Submit";

  @Output() onSubmit = new EventEmitter();

}
