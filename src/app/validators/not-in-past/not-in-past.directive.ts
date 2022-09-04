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
    const today = NotInPastDirective.toUTC(new Date())
    const date = NotInPastDirective.toUTC(new Date(control.value));
    const isInPast = date.getTime() < today.getTime();
    return isInPast ? { notInPast: {value: control.value} } : null;
  }

  private static toUTC(date: Date): Date {
    const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    return new Date(utc);
  }

}
