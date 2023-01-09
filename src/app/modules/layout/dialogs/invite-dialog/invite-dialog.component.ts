import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppUserForRide } from 'src/app/models/models';
import { UserServiceService } from 'src/app/modules/app-user/account/services/user.service';

@Component({
  selector: 'app-invite-dialog',
  templateUrl: './invite-dialog.component.html',
  styleUrls: ['./invite-dialog.component.css']
})
export class InviteDialogComponent implements OnInit {

  emailAddress: string = "";
  passengers: AppUserForRide[] = [];

  constructor(public dialogRef: MatDialogRef<InviteDialogComponent>, private snackBar: MatSnackBar,
    private userService: UserServiceService) { }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close(this.passengers);
  }

  onInviteClick(): void {
    this.userService.getUserByEmail(this.emailAddress).subscribe((user) => {
      console.log(user);
      this.snackBar.open("Successfully invited: " + this.emailAddress, "Close");
      this.passengers.push(user);
    })
    this.snackBar.open("This user does not exist: " + this.emailAddress, "Close");
      
  }

}
