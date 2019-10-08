import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
})
export class VideoPlayerComponent {
  @Input() poster: string;
  @Input() video: string;
  @Input() altText: string;
  @Input() isAutoPlay: boolean;
  @Input() showVideoPlayer: boolean;

  constructor() { }

  onVideoTriggerClick() {
    this.showVideoPlayer = true;
  }
}
