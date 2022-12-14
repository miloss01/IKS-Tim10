import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-register-driver',
  templateUrl: './register-driver.component.html',
  styleUrls: ['./register-driver.component.css']
})
export class RegisterDriverComponent implements OnInit {

  registerDriverForm = new FormGroup( {
    name: new FormControl(),
    lastName: new FormControl(),
    phone: new FormControl(),
    email: new FormControl(),
    password: new FormControl()
  })

  constructor(private router: Router, private appUserService: AppUserService) { }

  ngOnInit(): void {
  }

  registerDriver(): void {
    console.log("Value of form: " + JSON.stringify(this.registerDriverForm.value));
      this.appUserService
      .addPassenger(this.registerDriverForm.value)
      .subscribe((res: any) => {
        console.log(JSON.stringify(res));
      });
  }

}
