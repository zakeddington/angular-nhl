import { Component, Input, OnInit, Output } from '@angular/core';
import { CONSTANTS } from '../../config/Constants';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input() iconClass: string;
  @Input() iconBaseUrl: string = CONSTANTS.imgUrl.icon.base;
  @Input() iconId: string;

  @Output() iconUrl: string;

  ngOnInit() {
    this.iconUrl = this.iconBaseUrl + this.iconId;
  }
}
