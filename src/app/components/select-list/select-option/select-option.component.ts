import { Component, Input } from '@angular/core';

@Component({
  selector: 'select-option[item]',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss']
})
export class SelectOptionComponent<T> {

  @Input() public title = '';
  @Input() public item!: T;
  private _isSelected = false;
  private _changed = false;

  @Input() public set isSelected(selected: boolean) {
    this._isSelected = selected;
  }

  public get isSelected() {
    return this._isSelected;
  }

  public get changed() {
    return this._changed;
  }

  public select() {
    this._isSelected = !this._isSelected;
    this._changed = true;
  }
}
