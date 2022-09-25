import { Component, ContentChildren, QueryList } from '@angular/core';
import { SelectOptionComponent } from './select-option/select-option.component';

@Component({
  selector: 'select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss']
})

export class SelectListComponent<T> {

  @ContentChildren(SelectOptionComponent<T>) public options?: QueryList<SelectOptionComponent<T>>;
}
