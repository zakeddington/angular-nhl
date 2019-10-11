import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon/icon.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { PlayerPhotoComponent } from './player-photo/player-photo.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabsContentComponent } from './tabs/tabs-content.component';
import { LoaderComponent } from './loader/loader.component';
import { VideoCarouselComponent } from './video-carousel/video-carousel.component';
import { ModalTriggerComponent } from './modal/modal-trigger.component';
import { ModalContentComponent } from './modal/modal-content.component';
import { ModalContentDirective } from './modal/modal-content.directive';

@NgModule({
  entryComponents: [
    ModalContentComponent,
  ],
  declarations: [
    IconComponent,
    VideoPlayerComponent,
    PlayerPhotoComponent,
    TabsComponent,
    TabsContentComponent,
    LoaderComponent,
    VideoCarouselComponent,
    ModalTriggerComponent,
    ModalContentComponent,
    ModalContentDirective,
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
    ModalTriggerComponent,
    ModalContentComponent,
    ModalContentDirective,
  ]
})
export class SharedModule { }
