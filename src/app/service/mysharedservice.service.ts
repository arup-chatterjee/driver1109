import { AuthenticationService } from 'src/app/service/authentication.service';
import { Router } from '@angular/router';

import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { Platform, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { take, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { DriverData } from '../shared/models/driver-data';

import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';



@Injectable({
  providedIn: 'root'
})
export class MysharedserviceService {

  constructor(    
    private http: HttpClient,
    private plt: Platform, 
    private router: Router,
    private auth : AuthenticationService,
    private alertCtrl: AlertController,
    private network: Network
    ) { }


    public driverData: DriverData;

    async setDriverProfile(id : number){
  
      this.auth.getDriverProfile(id).subscribe(
        async res => {
          console.log("@getDriverProfile res : ", res);
  
          let regExp = /\(([^)]+)\)/;
          let matches = regExp.exec( res?.driverprofile?.preferred_pickup_location );
          let a = matches[1].split(" ");
          //console.log("a: ", a);
  
          this.driverData = <DriverData>{
            id :  id,
            username: res?.username,
            first_name: res?.first_name,
            last_name: res?.last_name,
            email: res?.email,
            is_driver: res?.is_driver,
  
            image: res?.driverprofile?.image,
            phone: res?.driverprofile?.phone,
            carnumber: res?.driverprofile?.carnumber,
            preferred_pickup_location: [ parseFloat(a[1]).toFixed(6), parseFloat(a[0]).toFixed(6) ],  //////  because leflet and django is not same!!!!,
            preferred_radius_in_km: res?.driverprofile?.preferred_radius_in_km,
            document: res?.driverprofile?.document,
            fare: res?.driverprofile?.fare,

            driver_passenger_set: res?.driver_passenger_set
          }

          

  
        },
        err => { console.log(" err: ", err); },
        () => {
        
          //console.log("testing ", this.driverData );
          this.auth.driverData =this.driverData;
          
        }
      );
    
    
    }




    trackCurrentLocationOfDriver(  latitude:number, longitude:number, altitude:number, accuracy:number  ):Observable<any>{
      
      let data = {  latitude : latitude, longitude:longitude, altitude:altitude, accuracy:accuracy   };

      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer  ' + this.auth.access.getValue()
        })
      };

      return this.http.put(`${environment.endPoint}driver_save_current_location/`, JSON.stringify(data), httpOptions)
        .pipe(
          take(1),
          map(res => { return res; } ),
          switchMap( 
            r =>{
              //console.log(" switchMap : ", r);
              let a = of(<any>r);
              return a;  
            }
          )
        );
      // return of(null);

    }

    startRide(passenger_id: number):Observable<any>{

      let data = { passenger_id: passenger_id };

      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer  ' + this.auth.access.getValue()
        })
      };

      return this.http.put(`${environment.endPoint}driver_ridestart/`, JSON.stringify(data), httpOptions)
        .pipe(
          take(1),
          map(res => { return res; } ),
          switchMap( 
            (r) =>{
              //console.log(" switchMap : ", r);
              let a = of(<any>r);
              return a;  
            }
          )
        );
      //return of(null);
      
    }

    endRide():Observable<any>{

      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer  ' + this.auth.access.getValue()
        })
      };

      return this.http.put(`${environment.endPoint}driver_rideend/`, {}, httpOptions)
        .pipe(
          take(1),
          map(res => { return res; } ),
          switchMap( 
            (r) =>{
              //console.log(" switchMap : ", r);
              let a = of(<any>r);
              return a;  
            }
          )
        );
    }


    ListUnpaidPassengerHistory():Observable<any>{
      console.log("@ListUnpaidPassengerHistory...");
  
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer  ' + this.auth.access.getValue()
        })
      };
  
      return this.http.get<any[]>(`${environment.endPoint}driver_list_unpaid_passengerhistory/`, httpOptions);
  
    }






    public listenConnection(): void {
      this.network.onDisconnect()
        .subscribe(() => {
          this.showAlert('Network:Offline ', "Please connect to network!");
        });
      
      this.network.onConnect()
        .subscribe(() =>{
          this.showAlert('Network:Online Type:'+this.network.type, "Network connected!");
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
