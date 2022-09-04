import { TestBed } from '@angular/core/testing';
import { FormControl, ValidationErrors } from '@angular/forms';
import { NotInPastDirective } from './not-in-past.directive';

describe('NotInPastDirective', () => {

  let directive: NotInPastDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotInPastDirective],
    });
    directive = TestBed.inject(NotInPastDirective);
  })

  it('should create an instance', () => {
    const directive = new NotInPastDirective();
    expect(directive).toBeTruthy();
  });

  it('should return error if date is in past', () => {
    const control = new FormControl();
    control.setValue('1/1/1900');
    const result = directive.validate(control);
    const expectedResult: ValidationErrors = { notInPast: {value: control.value} };
    expect(result).toEqual(expectedResult);
  })

  it('should return null if date is not in past', () => {
    const control = new FormControl();
    control.setValue('31/12/3000');
    const result = directive.validate(control);
    const expectedResult = null;
    expect(result).toEqual(expectedResult);
  })
});

