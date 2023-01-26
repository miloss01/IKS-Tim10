import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ChangePasswordDTO } from 'src/app/models/models'
import { UserServiceService } from 'src/app/modules/app-user/account/services/user.service'
import { LoginAuthentificationService } from 'src/app/modules/auth/service/login-authentification.service'

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit {
  oldPassword: string = ''
  code: string = ''
  newPassword: string = ''
  newPasswordRepeated: string = ''

  constructor (public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private readonly appUserService: UserServiceService,
    private readonly userAuthentificationService: LoginAuthentificationService,
    private readonly snackBar: MatSnackBar) { }

  ngOnInit (): void {
  }

  onCancelClick (): void {
    this.dialogRef.close()
  }

  requestCode (): void {
    if (this.newPassword !== this.newPasswordRepeated) {
      this.snackBar.open('New password and repeat password do not match', 'Close')
      return
    }
    const changePassword: ChangePasswordDTO = {
      newPassword: this.newPassword,
      oldPassword: this.oldPassword
    }

    this.appUserService.changePassword(changePassword, this.userAuthentificationService.getId()).subscribe((res: any) => {
      // this.submitted = !this.submitted
      this.snackBar.open('Password changed', 'Close')
    },
    (err: any) => {
      console.log(err)
      // this.errorMessage = err.error.message
      this.snackBar.open('Data not correct. please check again', 'Close')
    })
  }
}
