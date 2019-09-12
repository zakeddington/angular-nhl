import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {
  @Input() poster: string;
  @Input() video: string;
  @Input() altText: string;
  @Input() showVideo: boolean;

  constructor() { }

  ngOnInit() {
    console.log('this.poster', this.poster);
  }

  toggleVideoPlayer() {
    this.showVideo = true;
  }
}
