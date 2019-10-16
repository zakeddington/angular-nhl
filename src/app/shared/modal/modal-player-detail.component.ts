import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-player-detail.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalPlayerDetailComponent {
  @Input() data: Observable<any>;
  @Output() closeModalCallback = new EventEmitter<any>();

  constructor() { }

  onCloseModalClick() {
    this.closeModalCallback.emit();
  }
}
