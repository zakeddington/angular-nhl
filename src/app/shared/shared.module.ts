import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './logo/icon.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { PlayerPhotoComponent } from './player-photo/player-photo.component';

@NgModule({
  declarations: [
    IconComponent,
    VideoPlayerComponent,
    PlayerPhotoComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    IconComponent,
    VideoPlayerComponent,
    PlayerPhotoComponent,
  ]
})
export class SharedModule { }
