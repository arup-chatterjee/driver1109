import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { MysharedserviceService } from './../service/mysharedservice.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-menuone',
  templateUrl: './menuone.component.html',
  styleUrls: ['./menuone.component.scss'],
})
export class MenuoneComponent implements OnInit {

  constructor(private auth: AuthenticationService,
    private myService: MysharedserviceService,
    public loadingController: LoadingController,
    private router: Router
    ) { }

  ngOnInit() {}

  menuHide: boolean = true;
  user:any = {id: -1,  name: '', imgUrl: '' };
  toggleMenu() {
    this.menuHide= !this.menuHide;

    this.user.id = this.auth.driverData.id;
    this.user.name = this.auth.driverData.username;
    this.user.imgUrl = this.auth.driverData.image;
    //this.getProfile();/// 

    //console.log("user data menu ", this.auth.getUser() );

    //this.getSharedProfile();

  }
  hideMenu(e: Event) {
    console.log("clickOutside");
    this.menuHide= true;
  }



  logout() {
    this.presentLoading();
    this.auth.logout();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }




}
