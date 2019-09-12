import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './logo/icon.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

@NgModule({
  declarations: [
    IconComponent,
    VideoPlayerComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    IconComponent,
    VideoPlayerComponent,
  ]
})
export class SharedModule { }
