import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invite-dialog',
  templateUrl: './invite-dialog.component.html',
  styleUrls: ['./invite-dialog.component.css']
})
export class InviteDialogComponent implements OnInit {

  emailAddress: string = "";

  constructor(public dialogRef: MatDialogRef<InviteDialogComponent>, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onInviteClick(): void {
    this.snackBar.open("Successfully invited: " + this.emailAddress, "Close");
  }

}
