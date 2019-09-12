import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-player-photo',
  templateUrl: './player-photo.component.html',
  styleUrls: ['./player-photo.component.scss']
})
export class PlayerPhotoComponent {
  @Input() photoUrl: string;
}
