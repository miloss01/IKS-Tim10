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
    }).subscribe({
      next: (result: any) => {
        console.log(result);
        // localStorage.setItem('user', JSON.stringify(result));
        // this.authService.setUser();
        // this.router.navigate(['/']);
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          // this.hasError = true;
          console.log(error);
        }
      },
    });
  }

  goToRegister(): void {this.router.navigate(['/register-account']);}

}
