import { ClickOutsideModule } from 'ng-click-outside';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MenuoneComponent } from './menuone.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  exports: [MenuoneComponent],
  declarations: [MenuoneComponent],
  imports: [
    CommonModule, FormsModule, IonicModule, ClickOutsideModule
  ]
})
export class MenuoneComponentModule { }
