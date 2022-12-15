import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-block-dialog',
  templateUrl: './block-dialog.component.html',
  styleUrls: ['./block-dialog.component.css']
})
export class BlockDialogComponent implements OnInit {

  explanation: string = "";
  static userId = -1;

  constructor(
    public dialogRef: MatDialogRef<BlockDialogComponent>,
    private snackBar: MatSnackBar,
    private appUserService: AppUserService,
    ) { }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onBlockClick(): void {
    if (BlockDialogComponent.userId != -1) {
      if (this.appUserService.blockUser(BlockDialogComponent.userId)) {
        this.snackBar.open("Successfully blocked", "Close");
      }
    }
  }

}
