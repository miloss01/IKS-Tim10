import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ReasonDTO } from 'src/app/models/models';
import { RideServiceService } from 'src/app/modules/ride/service/ride-service.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-panic-dialog',
  templateUrl: './panic-dialog.component.html',
  styleUrls: ['./panic-dialog.component.css']
})
export class PanicDialogComponent implements OnInit {

  reason: string = ""
  rideId: number = 0

  constructor(public dialogRef: MatDialogRef<PanicDialogComponent>, 
              private rideService: RideServiceService, 
              @Inject(MAT_DIALOG_DATA) public data: any) 
              {
                this.rideId = data.rideId;
               }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onPanicClick(): void {
      
    let reason: ReasonDTO = {
      reason: this.reason
    } 
    this.rideService.raisePanic(this.rideId, reason)
    .subscribe((res: any) => {
      console.log(res);
      this.dialogRef.close();
    });

  }

}
