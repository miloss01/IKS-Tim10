import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ResetPasswordDialogComponent } from '../../layout/dialogs/reset-password-dialog/reset-password-dialog.component';
import { LoginAuthentificationService } from '../service/login-authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private authService: LoginAuthentificationService, public resetPasswordDialog: MatDialog) { }

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
      localStorage.setItem('user', JSON.stringify(res.accessToken));
      this.authService.setUser();
      console.log(this.authService.getRole());
      this.router.navigate(['/book-ride']);
    });
  }

  goToRegister(): void {this.router.navigate(['/register-account']);}

  openResetPasswordDialog(): void {
    const dialog = this.resetPasswordDialog.open(ResetPasswordDialogComponent);
  }

}
