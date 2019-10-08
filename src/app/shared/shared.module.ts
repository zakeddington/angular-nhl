import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon/icon.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { PlayerPhotoComponent } from './player-photo/player-photo.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabsContentComponent } from './tabs/tabs-content.component';
import { LoaderComponent } from './loader/loader.component';
import { VideoCarouselComponent } from './video-carousel/video-carousel.component';

@NgModule({
  declarations: [
    IconComponent,
    VideoPlayerComponent,
    PlayerPhotoComponent,
    TabsComponent,
    TabsContentComponent,
    LoaderComponent,
    VideoCarouselComponent,
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
    LoaderComponent,
    VideoCarouselComponent,
  ]
})
export class SharedModule { }
