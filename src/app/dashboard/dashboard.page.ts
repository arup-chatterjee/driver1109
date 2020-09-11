import { RidestartendInfoComponent } from './../ridestartend-info/ridestartend-info.component';
import { PassengerInfoComponent } from './../passenger-info/passenger-info.component';
import { MysharedserviceService } from './../service/mysharedservice.service';
import { AuthenticationService } from './../service/authentication.service';
import { Component, OnInit } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';
//import { Map, tileLayer, marker, polyline, Marker  } from 'leaflet';
import * as L from 'leaflet';

///////   test on esri 
import * as esri from 'esri-leaflet';
import  * as esri2 from 'esri-leaflet-geocoder';
import { PopoverController, AlertController } from '@ionic/angular';
//////


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  
    constructor(
      private popoverController: PopoverController,
      private alertCtrl: AlertController,
      private auth: AuthenticationService,
      private myservice: MysharedserviceService,
      private geolocation: Geolocation  
    ) 
    { 
    }
    
    map: L.Map;
    marker1: L.Marker;
    marker2: L.Marker;
    marker3: L.Marker;
    
    driverPoint: any= null;
    passengerPickUpPoint: any = null;
    passengerDropPoint: any = null;
    driverArea: number = 0;
    
    status_info :string = 'No Ride Is Active Now!';
    //driver_passenger_set: any = null;
    
    ///////////////////  for sending current location
    latitude:number = null;
    longitude:number = null;
    altitude:number = null;
    accuracy:number = null;
    //////////////////
    
    
    
    icon01: L.Icon = L.icon({
      iconUrl: 'assets/img/markers/marker-icon-gold.png',
      shadowUrl: 'assets/img/markers/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    icon02: L.Icon = L.icon({
      iconUrl: 'assets/img/markers/marker-icon-green.png',
      shadowUrl: 'assets/img/markers/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    icon03: L.Icon = L.icon({
      iconUrl: 'assets/img/markers/marker-icon-violet.png',
      shadowUrl: 'assets/img/markers/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    
    // isRide: boolean = false;
    
    
    ngOnInit() {
    }

        
    ionViewDidEnter(){
      this.showMap();
      //setInterval(() => {  this.refresh();  }, 12000);
      setTimeout( () => { this.refresh(); }, 1000 );
      setTimeout( () => { this.refresh(); }, 6000 );
    }
        
        
        
        
        
        
    async showMap(){
      this.map?.remove();


      
      
      //this.map = new Map('myMap').setView([22.723968, 88.4850196], 12);  // kolkata
      this.map = new L.Map('myMap', {minZoom: 5, maxZoom: 18 } ).setView([6.458465879581817, 3.3691165200434634], 12);
      // if(!gotData){
      //   this.map = new L.Map('myMap', {minZoom: 5, maxZoom: 18 } ).setView([6.458465879581817, 3.3691165200434634], 12);
      // }

      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
      
      esri.basemapLayer('Streets').addTo(this.map);
      
      const gotData = await this.plotDriverAndPassengerData();
      
      // click event if required
      this.map.on('click', (e) => {  });
      
    }
    async plotDriverAndPassengerData(){
      /////
      await this.auth.setNewAccess();
      let user_id = this.auth.getUser()['user_id'];
      this.myservice.setDriverProfile(user_id);
      //// set mydata   rename proper name
      
      ////
      console.log( "@show map...", this.auth.driverData?.preferred_pickup_location, this.auth.driverData?.preferred_radius_in_km );
      
      /////
      if( this.auth.driverData?.preferred_pickup_location  && this.auth.driverData?.preferred_radius_in_km ){
        
        this.driverPoint = this.auth.driverData?.preferred_pickup_location;
        this.driverArea = this.auth.driverData?.preferred_radius_in_km * 1000; // metre
        
        console.log("driver point: ", this.driverPoint, this.driverArea);
        
        //this.map = new L.Map('myMap', {minZoom: 5, maxZoom: 18 } ).setView(<L.LatLngExpression>this.driverPoint, 12);
        this.map.setView(<L.LatLngExpression>this.driverPoint, 12);
        
        var circle = L.circle(this.driverPoint, {
          color: '#bfbbb8',
          fillColor: '#8d97f0',
          fillOpacity: 0.2,
          radius: this.driverArea
        }
        ).addTo(this.map);
        
        this.marker1 = L.marker( <L.LatLngExpression>this.driverPoint, {icon: this.icon01} ).addTo(this.map).bindPopup(`My preffered point here`);
        
      }
      
      ///// ride booked!
      if( this.auth?.driverData?.driver_passenger_set ){
        
        console.log("got it :", this.auth.driverData );
        
        //this.isRide = this.auth.driverData?.driver_passenger_set?.is_accepted;
        
        let regExp = /\(([^)]+)\)/;
        let matches = regExp.exec( this.auth.driverData?.driver_passenger_set?.pickuppiont );
        let a = matches[1].split(" ");
        console.log("a: ", parseFloat(a[1]).toFixed(6), parseFloat(a[0]).toFixed(6) );
        
        this.passengerPickUpPoint = [parseFloat(a[1]).toFixed(6), parseFloat(a[0]).toFixed(6) ];
        
        let matches2 = regExp.exec( this.auth.driverData?.driver_passenger_set?.droppoint );
        let b = matches2[1].split(" ");
        console.log("b: ", parseFloat(b[1]).toFixed(6), parseFloat(b[0]).toFixed(6) );
        
        this.passengerDropPoint = [ parseFloat(b[1]).toFixed(6), parseFloat(b[0]).toFixed(6) ];
        
        this.marker2 = L.marker( <L.LatLngExpression> this.passengerPickUpPoint, {icon: this.icon02} ).addTo(this.map).bindPopup(`Pick up location`).openPopup();
        this.marker3 = L.marker(  <L.LatLngExpression> this.passengerDropPoint, {icon: this.icon03} ).addTo(this.map).bindPopup(`Drop location`);
        
        //////
        //this.driver_passenger_set = this.auth.driverData?.driver_passenger_set;
        this.status_info = 'Ride is Active';
        if(this.auth.driverData?.driver_passenger_set?.passengerhistory_set?.length > 0){
          this.status_info = 'Ride Has Started';
        }

      }

      if(user_id){
        return true;
      }
      return false;
      
    }





    
    /*
    refresh(){

      this.geolocation.getCurrentPosition({
          maximumAge: 1000,
          timeout: 5000,
          enableHighAccuracy: true 
        })
          .then( (resp) => {
            ///console.log("getCurrentPosition: ", resp );
            
            
            this.latitude = resp?.coords?.latitude;
            this.longitude = resp?.coords?.longitude;
            this.altitude = resp?.coords?.altitude;
            this.accuracy = resp?.coords?.accuracy;
            
            
            console.log("getCurrentPosition :" , this.latitude, this.longitude, this.altitude,  this.accuracy );
            
        },
        
        er=>{
          console.log('Can not retrieve Location');
        })
          .catch((error) => {
            console.log('Error getting location - '+JSON.stringify(error))
        })
          .then( ()=>{
            console.log(" send data to my service  ");
            this.myservice.trackCurrentLocationOfDriver(this.latitude, this.longitude, this.altitude, this.accuracy).subscribe(
              
              async res => {
                console.log('...got response...', res);
                
                /////////   show map after setting values
                this.showMap();
                /////////
              },
              err => { console.log("err : trackCurrentLocationOfDriver: ", err);   this.showMap(); },
              () => { console.log('...complete...'); }
            );
            
        });

        //this.showMap();  
    }

    */
    
    

  
   async refresh(){

    //successCallback,errorCallback,{timeout:10000}
    let getcurrentposition = null;
    try{

      getcurrentposition =  await this.geolocation.getCurrentPosition({
          maximumAge: 1000,
          timeout: 5000,
          enableHighAccuracy: true 
      });

    }
    catch( err){
      console.log("geo err:", err);
      getcurrentposition = null;
      await this.showMap();
      this.showAlert('Location:Error ', "Please Enable Location Services.");
    }

    if(getcurrentposition){
      

      this.latitude = getcurrentposition?.coords?.latitude;
      this.longitude = getcurrentposition?.coords?.longitude;
      this.altitude = getcurrentposition?.coords?.altitude;
      this.accuracy = getcurrentposition?.coords?.accuracy;  



      console.log(" send data to my service  ");
      this.myservice.trackCurrentLocationOfDriver(this.latitude, this.longitude, this.altitude, this.accuracy).subscribe(
        
        async res => {
          console.log('...got response...', res);
          
          /////////   show map after setting values
          await this.showMap();
          /////////
        },
        err => { console.log("err : trackCurrentLocationOfDriver: ", err);   this.showMap(); },
        () => {
          console.log('...complete...');
          let user_id = this.auth.getUser()['user_id'];
          this.myservice.setDriverProfile(user_id);
          //this.driver_passenger_set = 

        }
      );
    }
    


  }

  









        
        
        
        
    // locateMap(mapOb: any) {
    //   console.log(' locate is working...');
    //   mapOb.locate({setView: true, maxZoom: 12});
    // }
    // getPositions(){
    //   console.log('get potion');
    //   ///remove previous marker  
    //   if (this.marker1 != undefined) {
    //     this.map.removeLayer(this.marker1);
    //   };
      
    //   this.geolocation.getCurrentPosition({
    //     enableHighAccuracy: true,
        
    //   }).then( (res) =>{
    //     let latLong: any = null;
    //     return latLong = [
    //       res.coords.latitude,
    //       res.coords.longitude
    //     ]
    //   }).then( (latlng)=>{
    //     this.locateMap(this.map);
        
    //   });
      
    // }

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
        
        
        
        
        
    async presentPopover(ev: any) {
      const popover = await this.popoverController.create({
        component: PassengerInfoComponent,
        cssClass: 'my-custom-pop-class',
        event: ev,
        translucent: true,
        
        componentProps: { isRide: this.auth.driverData?.driver_passenger_set?.is_accepted, passenger: this.auth.driverData?.driver_passenger_set }
      });
      return await popover.present();
    }
    
    async presentPopover2(ev: any) {
      const popover = await this.popoverController.create({
        component: RidestartendInfoComponent,
        cssClass: 'my-custom-pop-class',
        event: ev,
        translucent: true,

        backdropDismiss: true,
        
        componentProps: {
          isRide: this.auth.driverData?.driver_passenger_set?.is_accepted,
          passenger: this.auth.driverData?.driver_passenger_set,

          DismissClick:  async () => { await popover.dismiss(); },
          Refresh: async () => { await this.refresh(); }
        }

      });
      return await popover.present();
    }
        
        
        
        
        
        
}
      