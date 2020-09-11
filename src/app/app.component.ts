import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private alertCtrl: AlertController,
    private network: Network
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.listenConnection();
    });
  }






  private listenConnection(): void {
    this.network.onDisconnect()
      .subscribe(() => {
        this.showAlert('Network:Offline '+this.network.type, "Please connect to network!");
      });
  }
  private async showAlert(header:string , msg:string ) {

    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-alert-class',
      mode: "ios",
      header: header,
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }




}
