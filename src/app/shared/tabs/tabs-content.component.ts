import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabs-content',
  template: `
    <div [hidden]="!active" class="tab-content">
      <ng-content></ng-content>
    </div>
  `
})
export class TabsContentComponent {
  @Input() tabTitle: string;
  @Input() active = false;
}
