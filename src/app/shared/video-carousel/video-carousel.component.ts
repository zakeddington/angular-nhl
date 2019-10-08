import { Component, Input, OnInit } from '@angular/core';
import { videoTransition } from './video-carousel.animations';

@Component({
  selector: 'app-video-carousel',
  styleUrls: ['./video-carousel.component.scss'],
  template: `
    <div class="video-carousel">
      <div class="video-carousel--player">
        <app-video-player [@videoTransition]="animate()" [showVideoPlayer]="selectedVideo.showVideoPlayer" [isAutoPlay]="true" [poster]="selectedVideo.poster" [video]="selectedVideo.url" [altText]="selectedVideo.posterAltText"></app-video-player>
      </div>
      <div class="video-carousel--thumbs">
        <button class="video-carousel--thumbs-item" [class.is-active]="video.active" (click)="selectVideo(video)" (mousedown)="onMousedown($event)" *ngFor="let video of data.videos">
          <div class="video-carousel--thumbs-poster">
            <img [src]="video.thumb" [alt]="video.posterAltText" />
            <app-icon iconClass="video-carousel--thumbs-icon" iconId="play-circle-filled"></app-icon>
          </div>
          <div class="video-carousel--thumbs-title">
            {{video.title}}
            <span class="video-carousel--thumbs-duration" *ngIf="video.duration">[{{video.duration}}]</span>
          </div>
        </button>
      </div>
    </div>
  `,
  animations: [ videoTransition ],
})
export class VideoCarouselComponent implements OnInit {
  @Input() data;
  selectedVideo;

  constructor() { }

  ngOnInit() {
    console.log('video carousel data', this.data);
    this.data.videos[0].active = true;
    this.selectedVideo = this.data.videos[0];
  }

  // prevent focus state on click
  onMousedown($event) {
    $event.preventDefault();
  }

  selectVideo(curVideo) {
    console.log('curVideo', curVideo);
    console.log('this.selectedVideo.active', this.selectedVideo.active, this.selectedVideo);
    this.data.videos.forEach(video => video.active = false);

    curVideo.active = true;
    curVideo.showVideoPlayer = true;
    this.selectedVideo = curVideo;
  }

  animate() {
    return this.selectedVideo.active;
  }
}
