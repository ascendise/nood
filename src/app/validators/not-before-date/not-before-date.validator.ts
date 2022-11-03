import { AbstractControl } from '@angular/forms';
import { DateTime } from 'luxon';

export class DateValidator {
  public static notBefore(minDate: DateTime) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let date = DateTime.fromJSDate(new Date(control.value));
      date = DateValidator.removeTime(date);
      minDate = DateValidator.removeTime(minDate);
      if (date < minDate) {
        return { notBeforeDate: true };
      }
      return null;
    };
  }

  private static removeTime(date: DateTime): DateTime {
    return date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  }
}
