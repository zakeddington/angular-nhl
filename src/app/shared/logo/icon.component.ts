import {Component, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  @Input() iconClass: string;
  @Input() iconBaseUrl: string;
  @Input() iconId: string;

  @Output() iconUrl: string;

  ngOnInit() {
    this.iconUrl = this.iconBaseUrl + this.iconId;
  }
}
