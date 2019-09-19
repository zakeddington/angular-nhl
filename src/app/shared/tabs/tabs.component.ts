import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
} from '@angular/core';

import { TabsContentComponent } from './tabs-content.component';

@Component({
  selector: 'app-tabs',
  template: `
    <ul class="tabs-nav">
      <li *ngFor="let tab of tabs" (click)="selectTab(tab)" class="tabs-nav-item">
        <button class="tabs-nav-link" [class.active]="tab.active">{{tab.tabTitle}}</button>
      </li>
    </ul>
    <ng-content></ng-content>
  `,
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabsContentComponent) tabs: QueryList<TabsContentComponent>;

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: TabsContentComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);

    // activate the tab the user has clicked on.
    tab.active = true;
  }
}
