import { Component, Input, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { ModalContentComponent } from './modal-content.component';
import { ModalContentDirective } from './modal-content.directive';
import { ModalContentItem } from './modal-content-item';
import { Observable, Subscription } from 'rxjs';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-modal-trigger',
  template: `
    <button class="modal--trigger" (click)="onModalTrigger($event)" (mousedown)="onMousedown($event)">
      <ng-content></ng-content>
    </button>
    <ng-template modal-host></ng-template>
  `,
  styleUrls: ['./modal.component.scss']
})
export class ModalTriggerComponent implements OnInit, OnDestroy {
  @Input() contentId: string;
  @Input() modalType: string;
  @ViewChild(ModalContentDirective, {static: true}) modalHost: ModalContentDirective;
  modalData$: Observable<any>;
  subscription: Subscription = new Subscription();
  viewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private playerService: PlayerService,
  ) { }

  ngOnInit() {
    console.log('ModalTriggerComponent ngOnInit');
    this.viewContainerRef = this.modalHost.viewContainerRef;
  }

  onModalTrigger($event) {
    console.log('onModalTrigger', $event, this.contentId);
    this.checkModalType();
    // this.loadModalContent();
  }

  // prevent focus state on click
  onMousedown($event) {
    $event.preventDefault();
  }

  checkModalType() {
    switch (this.modalType) {
      case 'player':
        if (!this.modalData$) {
          this.getPlayerData();
        } else {
          this.loadModalContent();
        }
        return;
      default:
        return;

    }
  }

  getPlayerData() {
    this.modalData$ = this.playerService.subscribeToPlayerData();
    this.playerService.getPlayerData(this.contentId);
    this.loadModalContent(this.modalData$);
  }

  loadModalContent(data = {}) {
    const modalContent = new ModalContentItem(ModalContentComponent, data);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(modalContent.component);
    this.viewContainerRef.clear();

    const componentRef = this.viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as ModalContentComponent).data = modalContent.data;
    componentRef.instance.closeModalCallback.subscribe(() => this.closeModal());
  }

  closeModal() {
    console.log('trigger closeModal');
    this.viewContainerRef.clear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
