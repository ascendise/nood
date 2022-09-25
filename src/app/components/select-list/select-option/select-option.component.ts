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

  public get isSelected() {
    return this._isSelected;
  }

  public select() {
    this._isSelected = !this._isSelected;
  }
}
