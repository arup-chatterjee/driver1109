import { AuthenticationService } from './../service/authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AlertController } from '@ionic/angular';

import { take, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private router: Router, private alertCtrl: AlertController, private auth: AuthenticationService){

  }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  canActivate(): Observable<boolean>{
    return this.auth.user.pipe(
      take(1),
      map( user =>{
        console.log('in can activate user');

        if(!user){

          ///////////alert
          this.alertCtrl.create({
            header: 'Unauthorized',
            message: 'You are not allowed to access that page.',
            buttons: ['OK']
          }).then(alert => alert.present());

          console.log('set alert here');
          this.router.navigateByUrl('/');

          return false;
        }else{
          return true;
        }
      })
    )
  }
  





}
