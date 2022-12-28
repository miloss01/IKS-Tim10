import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PasswordResetCodeDTO } from 'src/app/models/models';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.css']
})
export class ResetPasswordDialogComponent implements OnInit {

  email: string = "";
  code: string = "";
  newPassword: string = "";
  submitted: boolean = false;

  constructor(public dialogRef: MatDialogRef<ResetPasswordDialogComponent>, private appUserService: AppUserService) { }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  requestCode(): void {
    let data: PasswordResetCodeDTO = {
      email: this.email,
      newPassword: null,
      code: null
    }

    this.appUserService.requestCode(data).subscribe((res: any) => {
      this.submitted = !this.submitted;
    })
  }

  applyCode(): void {
    let data: PasswordResetCodeDTO = {
      email: this.email,
      newPassword: this.newPassword,
      code: this.code
    }

    this.appUserService.applyCode(data).subscribe((response: any) => {
      if (response.httpStatus == 204)
        this.dialogRef.close();
    })
  }

}
