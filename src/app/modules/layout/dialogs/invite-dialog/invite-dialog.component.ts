import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { AppUserForRide } from 'src/app/models/models'
import { UserServiceService } from 'src/app/modules/app-user/account/services/user.service'
import { LoginAuthentificationService } from 'src/app/modules/auth/service/login-authentification.service'

@Component({
  selector: 'app-invite-dialog',
  templateUrl: './invite-dialog.component.html',
  styleUrls: ['./invite-dialog.component.css']
})
export class InviteDialogComponent implements OnInit {
  emailAddress: string = ''
  passengers: AppUserForRide[] = []

  constructor (public dialogRef: MatDialogRef<InviteDialogComponent>, private readonly snackBar: MatSnackBar,
    private readonly userService: UserServiceService, private readonly userAuthentificationService: LoginAuthentificationService) { }

  ngOnInit (): void {
  }

  onCancelClick (): void {
    this.dialogRef.close(this.passengers)
  }

  onInviteClick (): void {
    this.userService.getUserByEmail(this.emailAddress).subscribe((user) => {
      user.id = 0
      console.log(user)
      this.snackBar.open('Successfully invited: ' + this.emailAddress, 'Close')
      if (this.userAuthentificationService.getEmail() !== this.emailAddress) { this.passengers.push(user) }
    })
    this.snackBar.open('This user does not exist: ' + this.emailAddress, 'Close')
  }

  ngOnDestroy (): void {
    this.dialogRef.close(this.passengers)
  }
}
