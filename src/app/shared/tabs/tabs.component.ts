import {Component, ContentChildren, QueryList, AfterContentInit, Input} from '@angular/core';
import { TabsContentComponent } from './tabs-content.component';

@Component({
  selector: 'app-tabs',
  template: `
    <div class="tabs {{tabsClass}}">
      <ul class="tabs-nav">
        <li *ngFor="let tab of tabs" class="tabs-nav-item">
          <button class="tabs-nav-link" (click)="selectTab(tab)" (mousedown)="onMousedown($event)" [class.active]="tab.active">
            <ng-container *ngIf="tab.iconBaseUrl">
              <app-icon [iconClass]="tab.iconClass" [iconBaseUrl]="tab.iconBaseUrl" [iconId]="tab.iconId"></app-icon>
            </ng-container>
            {{tab.tabTitle}}
          </button>
        </li>
      </ul>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabsContentComponent, {descendants: false}) tabs: QueryList<TabsContentComponent>;
  @Input() tabsClass: string;

  ngAfterContentInit() {
    // TODO: research life cycle hooks to see if this is best solution
    // setTimeout fixes ExpressionChangedAfterItHasBeenCheckedError
    // https://indepth.dev/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error/
    setTimeout(() => {
      // get all active tabs
      const activeTabs = this.tabs.filter((tab) => tab.active);

      // if there is no active tab set, activate the first
      if (activeTabs.length === 0) {
        this.selectTab(this.tabs.first);
      }
    });
  }

  // prevent focus state on click
  onMousedown($event) {
    $event.preventDefault();
  }

  selectTab(tab: TabsContentComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);

    // activate the tab the user has clicked on.
    tab.active = true;
  }
}
