import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalContentComponent {
  @Input() data: Observable<any>;
  @Output() closeModalCallback = new EventEmitter<any>();

  constructor() { }

  onCloseModalClick() {
    this.closeModalCallback.emit();
  }
}
