import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[notInPast]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: NotInPastDirective,
    multi: true
  }]
})
export class NotInPastDirective implements Validator{

  validate(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    const date = new Date(control.value)
    const isInPast = date < today;
    return isInPast ? { notInPast: {value: control.value} } : null;
  }

}
