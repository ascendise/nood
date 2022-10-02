import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  @Input() public message = 'Please confirm action';
  @Input() public confirmButtonText = 'Confirm';
  @Output() public confirmed = new EventEmitter();

  public confirm() {
    this.confirmed.emit();
  }
}
