import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ReasonDTO } from 'src/app/models/models';
import { RideServiceService } from 'src/app/modules/ride/service/ride-service.service';
import { BlockDialogComponent } from '../block-dialog/block-dialog.component';

@Component({
  selector: 'app-cancel-dialog',
  templateUrl: './cancel-dialog.component.html',
  styleUrls: ['./cancel-dialog.component.css']
})

export class CancelDialogComponent implements OnInit {
  explanation: string = "";
  static userId: number= -1;
  rideId:number = 0;
  reason:ReasonDTO = {
    reason: ''
  };

  constructor(
    public dialogRef: MatDialogRef<BlockDialogComponent>,
    private router: Router,
    private rideService: RideServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.rideId = data.rideId;
  }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onDeclineClick(): void {
    this.reason.reason = this.explanation;
    console.log(this.rideId);
    this.rideService
    .cancelRide(this.reason, this.rideId)
    .subscribe((res: any) => {
        console.log(res);
        this.router.navigate(['book-ride']); //TODO chage navigation
    });
    this.dialogRef.close();
  }

}
