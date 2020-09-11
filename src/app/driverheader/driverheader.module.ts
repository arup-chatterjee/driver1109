import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DriverheaderComponent } from './driverheader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [DriverheaderComponent],
  imports: [
    CommonModule, FormsModule, IonicModule
  ],
  exports: [DriverheaderComponent]
})
export class DriverheaderComponentModule { }
