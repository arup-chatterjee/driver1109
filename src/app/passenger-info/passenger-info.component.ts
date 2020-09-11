import { CallNumber } from '@ionic-native/call-number/ngx';
import * as moment from 'moment';
import { environment } from '../../environments/environment';

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-passenger-info',
  templateUrl: './passenger-info.component.html',
  styleUrls: ['./passenger-info.component.scss'],
})
export class PassengerInfoComponent implements OnInit {
  @Input("value") passenger: any;
  @Input("value") isRide: boolean;

  constructor(private callNumber: CallNumber) 
  {
  }

  ngOnInit() {

    console.log(this.passenger);

    this.passenger_name = this.toTitleCase(this.passenger?.user?.first_name + ' '+ this.passenger?.user?.last_name ) ;
    this.passengerImg = this.passenger?.user?.profile?.image;

    this.reqTime =  new Date(  this.passenger?.request_time  ); 
    this.formatted_date = moment( this.passenger?.request_time ).format('DD-MMM-YYYY,  h:mm a');

    this.phone = this.passenger?.user?.profile?.phone?.replace(/[^\w\s]/gi, '');
    this.passengerEmail = this.passenger?.user?.email;
  }

  passenger_name: string = '';
  passengerImg: string = '';
  reqTime: Date;
  formatted_date: string;
  phone: string;
  passengerEmail: string;


  toTitleCase(str: string){
    let str2 = str.toLowerCase().split(' ');
	  for (var i = 0; i < str2.length; i++) {
		  str2[i] = str2[i].charAt(0).toUpperCase() + str2[i].slice(1);
	  }
	  return str2.join(' ');
  }

  call(){
    this.callNumber.callNumber(this.phone, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

}
