import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.css']
})
export class RegisterAccountComponent implements OnInit {

  registerAccountForm = new FormGroup( {
    name: new FormControl(),
    surname: new FormControl(),
    telephoneNumber: new FormControl(),
    email: new FormControl(),
    password: new FormControl()
  })

  constructor(private router: Router, private appUserService: AppUserService) { }

  ngOnInit(): void {
  }

  registerAccount(): void {
      console.log("Value of form: " + JSON.stringify(this.registerAccountForm.value));
      this.appUserService
      .addPassenger(this.registerAccountForm.value)
      .subscribe((res: any) => {
        console.log(JSON.stringify(res));
      });
  }

}
