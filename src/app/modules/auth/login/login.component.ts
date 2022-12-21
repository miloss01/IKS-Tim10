import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginAuthentificationService } from '../service/login-authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private authService: LoginAuthentificationService) { }

  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  })

  ngOnInit(): void {
  }

  loginUser(): void {
    this.authService.login({
      "email": this.loginForm.value.username,
      "password": this.loginForm.value.password
    }).subscribe((res: any) => {
      console.log(res);
    });
  }

  goToRegister(): void {this.router.navigate(['/register-account']);}

}
