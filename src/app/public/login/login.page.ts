import { MysharedserviceService } from './../../service/mysharedservice.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../service/authentication.service';

import { Component, OnInit } from '@angular/core';
import { DriverData } from 'src/app/shared/models/driver-data';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private auth : AuthenticationService,
    private router: Router,
    private alertCtrl: AlertController,
    public loadingController: LoadingController,
    private myservice: MysharedserviceService

  ) 
  { }

  ngOnInit() {
    this.myservice.listenConnection();
  }

  private credentials = {
    email: '',
    pw: ''
  };

  driverData: DriverData;






  login() {
    this.presentLoading(2000);
    this.auth.login(this.credentials).subscribe(
      async res => {
        if (res) {
          console.log('login page res ', res);
          this.router.navigateByUrl('/members');
        } else {
          this.showAlert("Login Failed", "Wrong credentials");
        }
      },
      err => { 
        console.log('HTTP Error', err);
        this.showAlert("Error", err.error['detail'] !== undefined ? err.error['detail'] : "Invalid Credentials" ); //"Invalid Credentials"
      },
      () => {

        console.log( this.auth.getUser()['user_id'] );/////////

        console.log('HTTP request completed.'); 

        //this.setDriverProfile(this.auth.getUser()['user_id']);

        this.myservice.setDriverProfile(this.auth.getUser()['user_id']);

      }
    );
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


  async presentLoading( duration: number ) {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: duration
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      spinner: null,
      duration: 5000,
      message: 'Click the backdrop to dismiss early...',
      translucent: true,
      backdropDismiss: true
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed with role:', role);
  }





}
