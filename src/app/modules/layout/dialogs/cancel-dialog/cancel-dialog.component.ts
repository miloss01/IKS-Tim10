import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ReasonDTO } from 'src/app/models/models'
import { RideNotificationService } from 'src/app/modules/app-user/notification/service/ride-notification.service'
import { RideServiceService } from 'src/app/modules/ride/service/ride-service.service'
import { BlockDialogComponent } from '../block-dialog/block-dialog.component'

@Component({
  selector: 'app-cancel-dialog',
  templateUrl: './cancel-dialog.component.html',
  styleUrls: ['./cancel-dialog.component.css']
})

export class CancelDialogComponent implements OnInit {
  explanation: string = ''
  static userId: number = -1
  rideId: number = 0
  reason: ReasonDTO = {
    reason: ''
  }

  constructor (
    public dialogRef: MatDialogRef<BlockDialogComponent>,
    private readonly rideService: RideServiceService,
    private readonly notificationService: RideNotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.rideId = data.rideId
  }

  ngOnInit (): void {
  }

  onCancelClick (): void {
    this.dialogRef.close()
  }

  onDeclineClick (): void {
    this.reason.reason = this.explanation
    console.log(this.rideId)
    this.rideService
      .cancelRide(this.reason, this.rideId)
      .subscribe((res: any) => {
        console.log(res)
        this.notificationService.snackRideDeclined()
        this.notificationService.setUpdated(null)
      })
    this.dialogRef.close()
  }
}
