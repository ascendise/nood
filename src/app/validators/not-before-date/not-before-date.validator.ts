import { AbstractControl } from "@angular/forms";

export class DateValidator {

  public static notBefore(minDate: Date) {
    return (control: AbstractControl): {[key: string]: boolean } | null => {
      if(new Date(control.value) < minDate) {
        return  {'notBeforeDate': true}
      }
      return null;
    }
  }
}
