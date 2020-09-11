import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverFooterComponent } from './driver-footer.component';



@NgModule({
  declarations: [DriverFooterComponent],
  imports: [
    CommonModule, FormsModule, IonicModule
  ],
  exports: [DriverFooterComponent]
})
export class DriverFooterComponentModule { }
