import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './logo/icon.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { PlayerPhotoComponent } from './player-photo/player-photo.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabsContentComponent } from './tabs/tabs-content.component';

@NgModule({
  declarations: [
    IconComponent,
    VideoPlayerComponent,
    PlayerPhotoComponent,
    TabsComponent,
    TabsContentComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    IconComponent,
    VideoPlayerComponent,
    PlayerPhotoComponent,
    TabsComponent,
    TabsContentComponent,
  ]
})
export class SharedModule { }
