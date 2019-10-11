import { Component, Input, OnInit, Output, Type, EventEmitter } from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalContentComponent implements OnInit {
  @Input() data: Observable<any>;
  @Output() closeModalCallback = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log('ModalContentComponent this.data', this.data);
  }

  onCloseModalClick() {
    this.closeModalCallback.emit();
  }
}
