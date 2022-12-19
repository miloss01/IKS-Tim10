import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RideServiceService } from 'src/app/modules/ride/service/ride-service.service';
import { BlockDialogComponent } from '../block-dialog/block-dialog.component';

@Component({
  selector: 'app-cancel-dialog',
  templateUrl: './cancel-dialog.component.html',
  styleUrls: ['./cancel-dialog.component.css']
})
export class CancelDialogComponent implements OnInit {
  explanation: string = "";
  static userId = -1;

  constructor(
    public dialogRef: MatDialogRef<BlockDialogComponent>,
    private snackBar: MatSnackBar,
    private rideService: RideServiceService,
  ) { }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onDeclineClick(): void {
    
  }

}
