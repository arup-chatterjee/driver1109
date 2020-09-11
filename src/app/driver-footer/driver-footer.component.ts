import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-driver-footer',
  templateUrl: './driver-footer.component.html',
  styleUrls: ['./driver-footer.component.scss'],
})
export class DriverFooterComponent implements OnInit {

  constructor(private router: Router, public loadingController: LoadingController) { }

  ngOnInit() {}



  goToTnC(){
    this.presentLoading(200);
    this.router.navigateByUrl('/termsconditions');
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


}
