import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { MysharedserviceService } from './../service/mysharedservice.service';
import * as moment from 'moment';
//import { environment } from '../../environments/environment';

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-ridestartend-info',
  templateUrl: './ridestartend-info.component.html',
  styleUrls: ['./ridestartend-info.component.scss'],
})
export class RidestartendInfoComponent implements OnInit {
  @Input("value") passenger: any;
  @Input("value") isRide: boolean;

  @Input() DismissClick = async () => {};
  @Input() Refresh = async () => {};

  // @Output() demo = new EventEmitter<string>();

  // callParent(): void {
  //   this.demo.emit("This is the child component");
  // }

  constructor(
    public alertController: AlertController,
    private myservice: MysharedserviceService,
    private router: Router,
    public loadingController: LoadingController,
    
  )
  {
  }

  ngOnInit() {
    console.log("ngOnInit: ", this.passenger);
    this.formatted_currentDate = moment( this.currentDate ).format('DD-MMM-YYYY,  h:mm a');
  
    if(this.passenger?.passengerhistory_set?.length > 0){
      this.start_ride = true;
      this.end_ride = false;


            //ride_start_time
            //this.dateTime1 =  new Date(  this.passenger?.passengerhistory_set[0]?.ride_start_time  );
            this.formatted_date_start_time = moment( this.passenger?.passengerhistory_set[0]?.ride_start_time ).format('DD-MMM-YYYY,  h:mm a');
          
            //ride_end_time
            //this.dateTime2 =  new Date(  this.passenger?.passengerhistory_set[0]?.ride_end_time  );
            this.formatted_date_end_time = moment( this.passenger?.passengerhistory_set[0]?.ride_end_time ).format('DD-MMM-YYYY,  h:mm a');

            ///update to  server time( Lagos ) !
            this.formatted_currentDate = moment( this.passenger?.passengerhistory_set[0]?.date_now ).format('DD-MMM-YYYY,  h:mm a');;

            //this.diffTime = moment( this.formatted_date_start_time ).diff( moment(this.passenger?.passengerhistory_set[0]?.date_now), 'minutes');

            this.diffTime = Math.floor(<number>this.passenger?.passengerhistory_set[0]?.timeDifference_datetime_from_now / 60);
          
    }
  
  }


  currentDate = new Date();
  formatted_currentDate: string;

  // dateTime1: Date;
  // dateTime2: Date;
  formatted_date_start_time: string;
  formatted_date_end_time: string;

  //date_now: string;

  diffTime: number = 0;

  start_ride:boolean = false;
  end_ride:boolean = true;


  message:string = '';

  startRide(){
    //console.log("start ride...");
    if(!this.start_ride){
      this.message = '';
      this.presentStartAlertConfirm();
    }
    else{
      this.message = 'Info: Ride is already started';
    }
    
  }

  endRide(){
    //console.log("end ride...");
    
    if(!this.end_ride){
      this.message = '';
      this.presentEndAlertConfirm();
    }
    else{
      this.message = 'Info: Ride is not started';
    }
  }











  //1
  async presentStartAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-alert-class',
      header: 'Are you sure to start the ride?',
      message: '<strong>Please confirm</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, 
        {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');

            /////////////
            this.presentLoading(1000);
            this.Refresh();

            this.myservice.startRide(this.passenger?.id)
            .subscribe(
              async res => {
                console.log('start ride:  got response: ', res);
                
                this.DismissClick();
              },
              err => { console.log("err: ", err); },
              () => { }
            );
            /////////////

          }
        }
      ]
    });

    await alert.present();
  }

  //2
  async presentEndAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-alert-class',
      header: 'Are you sure to End the ride?',
      message: '<strong>Please confirm</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, 
        {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');

            /////////////
            this.presentLoading(1000);
            this.Refresh();
            
            
            this.myservice.endRide()
            .subscribe(
              async res => {
                console.log('end ride:  response: ', res);
                
                this.DismissClick();
                setTimeout(() => {
                  this.router.navigateByUrl('/members/tab1');
                }, 2000);
                
              },
              err => { console.log("err: ", err); },
              () => { }
            );
            /////////////

          }
        }
      ]
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




}
