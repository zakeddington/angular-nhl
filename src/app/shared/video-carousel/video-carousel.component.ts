import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-carousel',
  styleUrls: ['./video-carousel.component.scss'],
  template: `
      <div class="video-carousel">
          <div class="video-carousel--player">
              <app-video-player (videoPlayerCallback)="onVideoPlayerCallback($event)"
                [showVideoPlayer]="selectedVideoData.showVideoPlayer" [isAutoPlay]="true"
                [poster]="selectedVideoData.poster" [video]="selectedVideoData.url"
                [altText]="selectedVideoData.posterAltText"></app-video-player>
          </div>
          <div class="video-carousel--thumbs">
              <button class="video-carousel--thumbs-item" [class.is-active]="video.active"
                (click)="selectVideo(video, i)" (mousedown)="onMousedown($event)" *ngFor="let video of data.videos; let i = index">
                  <div class="video-carousel--thumbs-poster">
                      <img [src]="video.thumb" [alt]="video.posterAltText"/>
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
})
export class VideoCarouselComponent implements OnInit {
  @Input() data;
  maxVideoIndex;
  selectedVideoIndex;
  selectedVideoData;

  constructor() { }

  onVideoPlayerCallback(e) {
    switch (e.type) {
      case 'play':
        this.onVideoPlay();
        return;
      case 'ended':
        this.onVideoEnd();
        return;
      default:
        return;
    }
  }

  onVideoPlay() {
    this.selectedVideoData.showVideoPlayer = true;
  }

  onVideoEnd() {
    const { selectedVideoIndex, maxVideoIndex } = this;
    const nextIndex = selectedVideoIndex + 1;

    if (selectedVideoIndex < maxVideoIndex) {
      this.selectVideo(this.data.videos[nextIndex], nextIndex);
    } else if (selectedVideoIndex === maxVideoIndex) {
      this.selectedVideoData.showVideoPlayer = false;
    }
  }

  ngOnInit() {
    this.maxVideoIndex = this.data.videos.length - 1;
    this.selectedVideoIndex = 0;
    this.data.videos[0].active = true;
    this.selectedVideoData = this.data.videos[0];
  }

  // prevent focus state on click
  onMousedown($event) {
    $event.preventDefault();
  }

  selectVideo(curVideo, index) {
    this.data.videos.forEach((video) => {
      video.active = false;
      video.showVideoPlayer = false;
    });

    // we only need poster for last video
    if (index < this.maxVideoIndex) {
      curVideo.poster = '';
    }

    curVideo.active = true;
    curVideo.showVideoPlayer = true;
    this.selectedVideoData = curVideo;
    this.selectedVideoIndex = index;
  }
}
