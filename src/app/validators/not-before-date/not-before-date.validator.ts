import { AbstractControl } from "@angular/forms";

export class DateValidator {

  public static notBefore(minDate: Date) {
    return (control: AbstractControl): {[key: string]: boolean } | null => {
      let date = new Date(control.value)
      date = DateValidator.removeTime(date)
      minDate = DateValidator.removeTime(minDate)
      if(date < minDate) {
        return  {'notBeforeDate': true}
      }
      return null;
    }
  }

  private static removeTime(date: Date): Date {
    return new Date(date.toDateString());
  }
}
