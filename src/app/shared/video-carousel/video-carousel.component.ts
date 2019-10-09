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
                [title]="selectedVideoData.title" [duration]="selectedVideoData.duration"
                [altText]="selectedVideoData.posterAltText"></app-video-player>
          </div>
          <div class="video-carousel--thumbs">
            <div class="video-carousel--thumbs-item" [class.is-active]="video.active" *ngFor="let video of data.videos; let i = index">
              <button class="video-carousel--thumbs-trigger"
                (click)="selectVideo(video, i, true)" (mousedown)="onMousedown($event)">
                  <div class="video-carousel--thumbs-poster">
                    <img [src]="video.thumb" [alt]="video.posterAltText"/>
                    <app-icon iconClass="video-play-icon" iconId="play-circle-filled"></app-icon>
                  </div>
                  <div class="video-carousel--thumbs-title">
                    {{video.title}}
                    <span class="video-carousel--thumbs-duration" *ngIf="video.duration">[{{video.duration}}]</span>
                  </div>
              </button>
            </div>
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
    }
  }

  ngOnInit() {
    this.maxVideoIndex = this.data.videos.length - 1;
    this.selectedVideoIndex = 1;
    this.data.videos[1].active = true;
    this.selectedVideoData = this.data.videos[1];
  }

  // prevent focus state on click
  onMousedown($event) {
    $event.preventDefault();
  }

  selectVideo(curVideo, index, isAutoPlay = false) {
    this.data.videos.forEach((video) => {
      video.active = false;
      video.showVideoPlayer = false;
    });

    if (isAutoPlay) {
      curVideo.showVideoPlayer = true;
    }
    curVideo.active = true;
    this.selectedVideoData = curVideo;
    this.selectedVideoIndex = index;
  }
}
