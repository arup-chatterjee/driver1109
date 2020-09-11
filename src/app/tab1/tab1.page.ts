import { ViewChild } from '@angular/core';
import { LoadingController, IonSlides } from '@ionic/angular';
import { MysharedserviceService } from './../service/mysharedservice.service';
import { Component } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private auth: AuthenticationService,
    private myservice: MysharedserviceService,
    public loadingController: LoadingController
  )
  {}
  mySlideOptions = {  initialSlide: 0, loop: true, effect: 'flip', };

  @ViewChild('slides') slides: IonSlides;


  listOfRides = new Array<string>();

  baseurl:string = this.getBaseUrl();

  getBaseUrl(){
    // return environment.apiEndPoint.replace('/mobiapi/','');
    //!!https://stackoverflow.com/questions/5497318/replace-last-occurrence-of-character-in-string/41899895
    return environment.endPoint.replace(/\/drivermobiapi\/([^\/drivermobiapi\/]*)$/, '' + '$1');
  }

  async ionViewWillEnter(){

    await this.presentLoading(2000);


    await this.auth.setNewAccess();
    this.listOfRides = [];
    await this.getListUnpaidPassengerHistory();

  }



  async getListUnpaidPassengerHistory(){

    this.myservice.ListUnpaidPassengerHistory().subscribe(
      async res => {
        console.log(" res : ", res );
        
        let i = 0;
        res.forEach(element => {
          this.listOfRides.push(element);
          i++;
        });

        console.log(" i ", i);
        console.log(" listOfRides ", this.listOfRides );


      },
      err => { console.log(" err: ", err); },
      () => {
      }
    );

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



  async doRefresh(event) {
    console.log('Begin async operation');

    await this.auth.setNewAccess();
    this.listOfRides = [];
    await this.getListUnpaidPassengerHistory();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }

}
