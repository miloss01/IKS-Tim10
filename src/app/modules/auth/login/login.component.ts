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

  errorMessage: string = ""

  ngOnInit(): void {
  }

  loginUser(): void {
    this.authService.login({
      "email": this.loginForm.value.username,
      "password": this.loginForm.value.password
    }).subscribe(
      (response: any) => {
        console.log(response);
        localStorage.setItem('user', JSON.stringify(response.accessToken));
        this.authService.setUser();
        console.log(this.authService.getRole());
        this.router.navigate(['/book-ride']);
      
        if (this.authService.getRole() == "DRIVER"){
          this.authService.addWorkingHour().subscribe((res: any) => {
            this.authService.changeActiveFlag(true).subscribe((res: any) => {
              console.log(res);
            });
          });

        } else {
          this.authService.changeActiveFlag(true)
          .subscribe((res: any) => {
            console.log(res);
          });
        }
      },
      (err: any) => {
        console.log(err)
        this.errorMessage = err.error.message
      });
    
  }

  goToRegister(): void {this.router.navigate(['/register-account']);}

  openResetPasswordDialog(): void {
    const dialog = this.resetPasswordDialog.open(ResetPasswordDialogComponent);
  }

}
