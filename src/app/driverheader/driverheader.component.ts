import { AuthenticationService } from './../service/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-driverheader',
  templateUrl: './driverheader.component.html',
  styleUrls: ['./driverheader.component.scss'],
})
export class DriverheaderComponent implements OnInit {

  constructor(private auth: AuthenticationService) { }

  ngOnInit() {}

  logout() {
    this.auth.logout();
  }

}
