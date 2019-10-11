import { Type } from '@angular/core';

export class ModalContentItem {
  constructor(
    public component: Type<any>,
    public data: any,
  ) {}
}
