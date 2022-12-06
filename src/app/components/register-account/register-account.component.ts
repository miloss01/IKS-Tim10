import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.css']
})
export class RegisterAccountComponent implements OnInit {

  registerAccountForm = new FormGroup( {
    name: new FormControl(),
    lastName: new FormControl(),
    phone: new FormControl(),
    email: new FormControl(),
    password: new FormControl()
  })

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  registerAccount(): void {

  }

}
