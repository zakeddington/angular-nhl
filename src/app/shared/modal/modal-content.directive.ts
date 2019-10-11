import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[modal-host]',
})
export class ModalContentDirective {
  constructor(
    public viewContainerRef: ViewContainerRef
  ) { }
}
