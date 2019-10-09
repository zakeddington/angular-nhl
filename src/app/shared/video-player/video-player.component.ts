import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
})
export class VideoPlayerComponent {
  @Input() poster: string;
  @Input() video: string;
  @Input() altText: string;
  @Input() title: string;
  @Input() duration: string;
  @Input() isAutoPlay: boolean;
  @Input() showVideoPlayer: boolean;
  @Output() videoPlayerCallback = new EventEmitter<object>();

  constructor() { }

  onVideoTriggerClick() {
    this.showVideoPlayer = true;
  }

  onVideoEvent(e) {
    this.videoPlayerCallback.emit(e);
  }
}
