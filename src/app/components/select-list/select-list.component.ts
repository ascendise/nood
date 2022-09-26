import { Component, ContentChildren, QueryList } from '@angular/core';
import { SelectOptionComponent } from './select-option/select-option.component';

@Component({
  selector: 'select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss']
})

export class SelectListComponent<T> {
  @ContentChildren(SelectOptionComponent<T>) public options?: QueryList<SelectOptionComponent<T>>;

  public get selectedItems() {
    const items = this.options?.filter((o) => o.isSelected)
    .filter((o) => o.item != null)
    .map((o) => o.item);
    return (items ? items: []) as T[];
  }

  public get changedOptions() {
    const options = this.options?.filter((o) => o.changed);
    return (options ? options: []) as SelectOptionComponent<T>[];
  }
}
