import { Component, Input } from '@angular/core';

@Component({
  selector: 'select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss']
})

export class SelectListComponent<T> {
  @Input() public options: SelectListOption<T>[] = [];

  public select(option: SelectListOption<T>){
    option.selected = (option.selected !== true);
    console.log(this.options);
  }
}

export interface SelectListOption<T> {
  displayText: string,
  item: T,
  selected: boolean,
}
