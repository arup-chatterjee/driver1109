import { Network } from '@ionic-native/network/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
    ClickOutsideModule,
    CallNumber,
    Network
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
