import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';

import { take, map, switchMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { DriverData } from '../shared/models/driver-data';

const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';
const TOKEN_REFRESH = 'jwt-token-refresh';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private plt: Platform, 
    private router: Router,
  )
  {

    this.loadStoredToken();
   }


  public user: Observable<any>;
  public userData = new BehaviorSubject(null);
 

  public access = new BehaviorSubject(null);
  public refresh = new BehaviorSubject(null);

  public driverData: DriverData;

  endPoint: string= environment.endPoint;

  async loadStoredToken(){
    let PlatformObj =  from( this.plt.ready() );

    this.user = PlatformObj.pipe(
      switchMap(
        () => {
          return from(this.storage.get(TOKEN_KEY))      
      }),
      map( token =>{
        console.log('Token from storage:  ', token);

        if(token){

          this.loadTokenRefresh();/////// refresh acess

          let decoded = helper.decodeToken(token);
          console.log('Decoded: ', decoded);
          this.userData.next(decoded); 
          return true;
        }
        else{
          return null;
        }

      })
    );

  }


  async loadTokenRefresh(){

    await this.storage.get('jwt-token').then((result) => {
      this.access.next(result);
    });

    await this.storage.get('jwt-token-refresh').then((result) => {
      this.refresh.next(result)
    });

  }


  async setNewAccess(){

    let refreshdata: any = {
      "refresh": await this.refresh.getValue()
    };


    this.http.post(`${this.endPoint}token/refresh/`, refreshdata)
    .subscribe(
      async res => {
         let newaccess = res.hasOwnProperty('access') ? res['access'] : '';
         this.access.next(newaccess);
         console.log("newaccess->  ", this.access.getValue()  );

      },
      err => { console.log("@setNewAccess", err) },
      () => {  }

    );

  }



  login(credentials:{email: string, pw:string }):Observable<any>{

    let data :any = { email: credentials.email,
      username: credentials.email,
      password:credentials.pw,
    };


    return this.http.post(`${this.endPoint}token/`, data ).pipe(  
      take(1),
      map(res => {

        console.log("res : ", res );
        //console.log("res : ", res.hasOwnProperty('access')  );
        let access = res.hasOwnProperty('access') ? res['access'] : '';
        let refresh = res.hasOwnProperty('refresh') ? res['refresh'] : '';
        console.log(" got access token : ", access);
        console.log(" got refresh token : ", refresh);

        //access
        //eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk4MzYyNTc5LCJqdGkiOiI4MWU3NWUwYjgyZWU0YWUzYjNhMzBhNzNjNWZhMjNhYyIsInVzZXJfaWQiOjR9._2VnRk8GxoVpO-ugbcccQcsCLvtc9HYvQMad2uqo1pY
        
        //refresh
        //eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTU5ODQ0ODY3OSwianRpIjoiMGY0OWU2ZGM0Mjk5NGU5YmJmNGRjMDM0OWJjNjExY2YiLCJ1c2VyX2lkIjo0fQ.1wKPHvEAMGG0jLG8Dg1oLNNon66lSJmQKBoXfGHQbNE
        
        return {access:access, refresh:refresh };
      }),
      switchMap( token => {

        this.access.next(token.access);
        this.refresh.next(token.refresh);

        let access_decoded = helper.decodeToken(token.access);
        console.log('login Decoded: ', access_decoded);
        let refresh_decoded = helper.decodeToken(token.refresh);
        console.log('login Decoded: ', refresh_decoded);

        this.userData.next(access_decoded);

        let  storageObs =  from( this.storage.set(TOKEN_KEY, token.access) ); 
        let  storageObs2 =  from( this.storage.set(TOKEN_REFRESH, token.refresh) ); 

        //this.loadTokenRefresh();/////// refresh acess
        //this.setNewAccess();//////////
        
        return storageObs;
      })



    );
    
  }



  /*
    private credentials = {
    email: '',
    pw: '',
    pw2: '',
    username:'',
    first_name: '',
    last_name: '',
    phone: '',
    car_no: '',
  };
  */
  userRegister(credentials:{email: string,
     pw:string,
     pw2:string,
     username:string,

     first_name: string,
     last_name: string,
     phone: string,
     carnumber: string,

  }):Observable<any>{
    
    let data :any = {
      email: credentials.email,
      username: credentials.email,
      password:credentials.pw,
      first_name: credentials.first_name,
      last_name: credentials.last_name,
      phone: credentials.phone,
      carnumber: credentials.carnumber,
    };
    
    if(credentials.pw === credentials.pw2 && credentials.pw != null ){
      console.log('inside auth resister', data );      
      return this.http.post(`${this.endPoint}createdriver/`, data);
      
      
      //drivewr test
      //return this.http.post(`http://localhost:8000/drivermobiapi/drivers/`, data);
    }

    return of(null);
  }


  getUser(){
    return this.userData.getValue();
  }

  getDriverProfile(id: number):Observable<any>{
    console.log("@GetDriverProfile...");
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer  ' + this.access.getValue()
      })
    };

    //return this.http.post(`${this.apiEndPoint}hello/`, JSON.stringify({}), httpOptions);
    return this.http.get<any[]>(`${this.endPoint}drivers/${id}/`, httpOptions);     
  }

  logout(){
    this.storage.remove(TOKEN_REFRESH);
    this.storage.remove(TOKEN_KEY).then( ()=>{
      this.router.navigateByUrl('/'),
      this.userData.next(null);
    });
  }














}
