import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { DateValidator } from './not-before-date.validator';

describe('NotBeforeDateValidator', () => {
  it('should return error if date is before specified date', () => {
    const control = new FormControl();
    control.setValue('1/1/1900');
    const result = DateValidator.notBefore(DateTime.now())(control);
    const expectedResult = { notBeforeDate: true };
    expect(result).toEqual(expectedResult);
  });

  it('should return error if date is null', () => {
    const control = new FormControl();
    control.setValue(null);
    const result = DateValidator.notBefore(DateTime.now())(control);
    const expectedResult = { notBeforeDate: true };
    expect(result).toEqual(expectedResult);
  });

  it('should return null if date is after specified date', () => {
    const control = new FormControl();
    control.setValue('1/1/1901');
    const result = DateValidator.notBefore(DateTime.fromISO('1900-01-01'))(control);
    expect(result).toBeNull();
  });

  it('should return null if date is equal to specified date', () => {
    const control = new FormControl();
    control.setValue('1/1/1900');
    const result = DateValidator.notBefore(DateTime.fromISO('1900-01-01'))(control);
    expect(result).toBeNull();
  });

  it('should ignore time of date', () => {
    const control = new FormControl();
    control.setValue('1/1/1900 2:00:00');
    const result = DateValidator.notBefore(DateTime.fromISO('1900-01-01T04:00:00.00'))(control);
    expect(result).toBeNull();
  });
});
