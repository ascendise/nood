import { Component, Input } from '@angular/core';

@Component({
  selector: 'select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss']
})
export class SelectOptionComponent<T> {

  @Input() public title = '';
  @Input() public item: T | null = null;
  private _isSelected = false;

  @Input() public set isSelected(selected: boolean) {
    this._isSelected = selected;
  }

  public get isSelected() {
    return this._isSelected;
  }

  public select() {
    this._isSelected = !this._isSelected;
  }
}
