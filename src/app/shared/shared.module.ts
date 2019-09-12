import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './logo/icon.component';



@NgModule({
  declarations: [
    IconComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    IconComponent,
  ]
})
export class SharedModule { }
