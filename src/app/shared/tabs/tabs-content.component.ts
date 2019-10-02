import { Component, Input } from '@angular/core';
import { tabsTransition } from './tabs.animations';

@Component({
  selector: 'app-tabs-content',
  template: `
    <div [hidden]="!active" class="tab-content" [@tabsTransition]="animateTab()">
      <ng-content></ng-content>
    </div>
  `,
  animations: [ tabsTransition ],
})
export class TabsContentComponent {
  @Input() tabTitle: string;
  @Input() iconClass: string;
  @Input() iconBaseUrl: string;
  @Input() iconId: string;
  @Input() active = false;

  animateTab() {
    return this.active;
  }
}
