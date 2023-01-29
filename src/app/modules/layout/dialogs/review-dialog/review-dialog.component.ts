import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewService } from 'src/app/modules/ride/review/service/review.service';
import { ReviewRequest } from 'src/app/models/models';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.css']
})
export class ReviewDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private snackBar: MatSnackBar,
    private reviewService: ReviewService
  ) { 
    this.rideId = data["rideId"];
  }
  
  @Input('rating') driverRating: number = 1;
  @Input('starCount') driverStarCount: number = 5;
  @Input('color') color: string = 'accent';
  driverRatingArr: number[] = [];

  @Input('rating') vehicleRating: number = 1;
  @Input('starCount') vehicleStarCount: number = 5;
  vehicleRatingArr: number[] = [];

  driverComment: string = ''
  vehicleComment: string = ''


  rideId: number = -1

  ngOnInit(): void {
    for (let index = 1; index <= this.driverStarCount; index++) {
      this.driverRatingArr.push(index);
    }
    for (let index = 1; index <= this.vehicleStarCount; index++) {
      this.vehicleRatingArr.push(index);
    }
  }

  onClick(rating:number, role: string) {
    if (role === 'DRIVER') {
      this.driverRating = rating
      this.driverRatingArr = []
      for (let index = 1; index <= this.driverStarCount; index++) {
        this.driverRatingArr.push(index);
      }
    } else {
      this.vehicleRating = rating
      this.vehicleRatingArr = []
      for (let index = 1; index <= this.vehicleStarCount; index++) {
        this.vehicleRatingArr.push(index);
      }
    }
    
    return false;
  }

  showIcon(index:number, role: string) {
    if (role === 'DRIVER') {
      if (this.driverRating >= index + 1) {
        return 'star';
      } else {
        return 'star_border';
      }
    } else {
      if (this.vehicleRating >= index + 1) {
        return 'star';
      } else {
        return 'star_border';
      }
    }
      
  }

  getRating(ratingId: number): string {
    return "" + ratingId
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSendClick(): void {
    this.reviewService.saveDriverReview(this.rideId, {comment: this.driverComment, rating: this.driverRating}).subscribe(res => {
      this.snackBar.open("Rating sent!", "Close");
      this.dialogRef.close();
    })
    this.reviewService.saveVehicleReview(this.rideId, {comment: this.vehicleComment, rating: this.vehicleRating}).subscribe(res => {
      this.snackBar.open("Rating sent!", "Close");
    })
  }

}
