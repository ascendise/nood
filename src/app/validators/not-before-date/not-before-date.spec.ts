import { FormControl } from "@angular/forms";
import { DateValidator } from "./not-before-date.validator";

describe('NotBeforeDateValidator', () => {

  it('should return error if date is before specified date', () => {
    const control = new FormControl();
    control.setValue('1/1/1900');
    const result = DateValidator.notBefore(new Date(Date.now()))(control);
    const expectedResult = {'notBeforeDate': true}
    expect(result).toEqual(expectedResult);
  });

  it('should return error if date is null', () => {
    const control = new FormControl();
    control.setValue(null);
    const result = DateValidator.notBefore(new Date(Date.now()))(control);
    const expectedResult = {'notBeforeDate': true}
    expect(result).toEqual(expectedResult);
  })

  it('should return null if date is after specified date', () => {
    const control = new FormControl();
    control.setValue('1/1/1901');
    const result = DateValidator.notBefore(new Date('1/1/1900'))(control);
    expect(result).toBeNull();
  });

  it('should return null if date is equal to specified date', () => {
    const control = new FormControl();
    control.setValue('1/1/1900');
    const result = DateValidator.notBefore(new Date('1/1/1900'))(control);
    expect(result).toBeNull();
  });
})

