import { MysharedserviceService } from './../../service/mysharedservice.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private alertCtrl: AlertController,
    public loadingController: LoadingController,
    private myservice: MysharedserviceService
  ) { }

  ngOnInit() {
    this.myservice.listenConnection();
  }

  private credentials = {
    email: '',
    pw: '',
    pw2: '',
    username:'',
    first_name: '',
    last_name: '',

    phone: '',
    carnumber: '',


    
  };


  register() {
    console.log(" Register : ", this.credentials );

    if(this.credentials.pw2 === this.credentials.pw){
      this.credentials.username = this.credentials.email;
      this.auth.userRegister({

                email: this.credentials.email,
                pw: this.credentials.pw,
                pw2: this.credentials.pw2,
                username: this.credentials.username,

                first_name: this.credentials.first_name,
                last_name: this.credentials.last_name,
                phone: this.credentials.phone,
                carnumber: this.credentials.carnumber,

      }).subscribe(
        async res => {
          console.log(' response ', res);

          if( res.status == 201  ){
            this.showAlert("Registration Success!", "Thank you for registration");
            this.router.navigate(['/'] );
  
          }
          else{
            this.showAlert("Registration failed!", res.msg);
          }

        },
        async error => { 

          //let msg:any =  error.error[Object.keys( error.error )[0]]; //// first error

          console.log('error', error);
          //this.showAlert("Registration failed!", error.error);
          
        },

      );

    }
    else{
      this.showAlert("Error", 'Password not same');
      
    }
  }






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



  private async showAlert(header:string , msg:string ) {

    const alert = await this.alertCtrl.create({
      header: header,
      message: msg,
      buttons: ['OK']
    });
    await alert.present();

  }

}
