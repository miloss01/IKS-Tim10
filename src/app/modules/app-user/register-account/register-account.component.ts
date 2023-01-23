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
    address: new FormControl(),
    password: new FormControl(),
    confirmPassword: new FormControl()
  })

  errorMessage: string = ""

  constructor(private router: Router, private appUserService: AppUserService) { }

  ngOnInit(): void {
  }

  registerAccount(): void {
      console.log("Value of form: " + JSON.stringify(this.registerAccountForm.value));

      if (this.registerAccountForm.value.password != this.registerAccountForm.value.confirmPassword) {
        this.errorMessage = "Passwords don't match"
        return
      }

      this.appUserService
      .addPassenger({
        name: this.registerAccountForm.value.name,
        surname: this.registerAccountForm.value.surname,
        telephoneNumber: this.registerAccountForm.value.telephoneNumber,
        email: this.registerAccountForm.value.email,
        address: this.registerAccountForm.value.address,
        password: this.registerAccountForm.value.password,
      })
      .subscribe(
        (res: any) => {
          console.log(JSON.stringify(res));
          this.errorMessage = ""
        },
        (err: any) => {
          console.log(err)
          if (err.error.message != undefined) {
            this.errorMessage = err.error.message
            return
          }
          this.errorMessage = err.error
        }
      );
  }

}
