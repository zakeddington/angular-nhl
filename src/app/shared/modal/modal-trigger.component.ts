import { Component, Input, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { ModalContentComponent } from './modal-content.component';
import { ModalContentDirective } from './modal-content.directive';
import { ModalContentItem } from './modal-content-item';
import { Observable, Subscription, ReplaySubject } from 'rxjs';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-modal-trigger',
  template: `
    <button class="modal--trigger" (click)="onModalTrigger($event)" (mousedown)="onMousedown($event)">
      <ng-content></ng-content>
    </button>
    <ng-template modal-host></ng-template>
  `,
  styleUrls: ['./modal.component.scss'],
  providers: [PlayerService],
})
export class ModalTriggerComponent implements OnInit, OnDestroy {
  @Input() contentId: string;
  @Input() modalType: string;
  @ViewChild(ModalContentDirective, {static: true}) modalHost: ModalContentDirective;
  modalData$: Observable<any>;
  cacheData = new ReplaySubject(1);
  cacheData$ = this.cacheData.asObservable();
  subscription: Subscription = new Subscription();
  viewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private playerService: PlayerService,
  ) { }

  ngOnInit() {
    this.viewContainerRef = this.modalHost.viewContainerRef;
  }

  onModalTrigger($event) {
    this.checkModalType();
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
          this.loadModalContent(this.cacheData$);
        }
        return;
      default:
        return;
    }
  }

  getPlayerData() {
    this.modalData$ = this.playerService.subscribeToPlayerData();
    this.modalData$.subscribe(res => {
      this.cacheData.next(res);
    });
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
    this.viewContainerRef.clear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
