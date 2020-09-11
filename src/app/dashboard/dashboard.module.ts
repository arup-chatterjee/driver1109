import { MenuoneComponentModule } from './../menuone/menuone.module';
import { DriverheaderComponentModule } from './../driverheader/driverheader.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    DriverheaderComponentModule,
    MenuoneComponentModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
