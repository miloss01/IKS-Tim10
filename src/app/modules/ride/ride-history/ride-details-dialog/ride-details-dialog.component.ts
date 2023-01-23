import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap } from 'rxjs';
import { AppUser, AppUserForRide, Ride, RideReview } from 'src/app/models/models';
import { UserServiceService } from 'src/app/modules/app-user/account/services/user.service';
import { LoginAuthentificationService } from 'src/app/modules/auth/service/login-authentification.service';
import { ReviewDialogComponent } from 'src/app/modules/layout/dialogs/review-dialog/review-dialog.component';
import { MapComponent } from 'src/app/modules/layout/map/map.component';
import { MapService } from 'src/app/modules/layout/services/map.service';
import { ReviewService, RideReviewsDTO } from '../../review/service/review.service';
import { RideServiceService } from '../../service/ride-service.service';

@Component({
  selector: 'app-ride-details-dialog',
  templateUrl: './ride-details-dialog.component.html',
  styleUrls: ['./ride-details-dialog.component.css']
})
export class RideDetailsDialogComponent implements OnInit {

  public ride : Ride;
  review: RideReview = {
    driverReview: {
      id: -1,
      rating: -1,
      comment: "",
      passenger: {id:-1, email: ""}
    },
    vehicleReview: {
      id: -1,
      rating: -1,
      comment: "",
      passenger: {id:-1, email: ""}
    }
  }

  public reviewsShow : boolean = false

  public passengersForDisplay : AppUser[] = []

  public driverForDisplay : AppUser | undefined

  public canLeaveReview : boolean = false
  
  @ViewChild(MapComponent, {static : true}) map : MapComponent | undefined;

  // Property for hiding elements for driver and admin.
  public role : String = "";


  constructor(public dialogRef: MatDialogRef<RideDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private router: Router,
    private mapService: MapService,
    private reviewService : ReviewService,
    private userService : UserServiceService,
    private authService : LoginAuthentificationService,
    private snackBar: MatSnackBar,
    private rideService : RideServiceService,
    private route: ActivatedRoute,
    public reviewDialog: MatDialog) {
      this.ride = data["ride"];
      this.role = authService.getRole();
  }
  
  forRouteControl = {
    depLat: 0,
    depLon: 0,
    desLat: 0,
    desLon: 0
  };

  ngOnInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 1000);
    this.route.params.subscribe((params) => {
      this.getReviewsForDisplay();
      this.getDriverForDisplay();
      this.getPassengersForDisplay();
      this.checkCanLeaveReview();
    })
  }
  
  private initMap() {
    this.mapService.postRequest(
      this.ride.locations[0].departure.address, 
      this.ride.locations[0].destination.address)
    .pipe(
      mergeMap(() => this.mapService.departureState),
      map((res: any) => {
        this.forRouteControl.depLat = this.ride.locations[0].departure.latitude;
        this.forRouteControl.depLon = this.ride.locations[0].departure.longitude;
      }),

      mergeMap(() => this.mapService.destinationState),
      map((res: any) => {
        this.forRouteControl.desLat = this.ride.locations[0].destination.latitude;
        this.forRouteControl.desLon = this.ride.locations[0].destination.longitude;
      })
    )
    .subscribe((res: any) => {
      let routeControl = this.map?.drawRoute(
        // ovi podaci se moraju dobiti iz servisa
        this.forRouteControl.depLat,
        this.forRouteControl.depLon,
        this.forRouteControl.desLat,
        this.forRouteControl.desLon
      );
    })
  }

  displayReviewsOnClick(email:String) {
    if (this.review.driverReview.id != -1 && this.review.driverReview.passenger.email === email) {
      this.reviewsShow = true;
    }
    else {
      this.snackBar.open("Passenger didn't leave reviews.", "Close");
    }
  }

  // Generates a list of passengers with details for displaying data such as name and profile picture.
  getPassengersForDisplay() {
    let user:AppUserForRide;
    for (let i = 0 ; i < this.ride.passengers.length ; i++) {
      user = this.ride.passengers[i];
      this.userService.getPassengerById(user.id)
      .subscribe((fetchedUser:AppUser) => {
        this.passengersForDisplay.push(fetchedUser);
        })
    }
  }

  getDriverForDisplay() { 
    this.userService.getDriverById(this.ride.driver.id)
      .subscribe((fetchedUser:AppUser) => {
        this.driverForDisplay = fetchedUser;
        })
  }

  onClickRideAgain() {
    this.rideService.setbookAgainValue(this.ride.locations);
    this.dialogRef.close();
    this.router.navigate(['/book-ride']);
  }

  getReviewsForDisplay() {
    this.reviewService
      .getReviews(this.ride.id)
      .subscribe((fetchedReviews:RideReview[]) => {
        if (fetchedReviews.length != 0) {
          this.review = fetchedReviews[0];
          console.log(fetchedReviews)
          if (this.review.driverReview != null) this.review.driverReview = fetchedReviews[0].driverReview;
          if (this.review.vehicleReview != null) this.review.vehicleReview = fetchedReviews[0].vehicleReview;
        }
      });
  }

  onClickLeaveReview() {
    if (this.checkCanLeaveReview()) {
      const rideDetailsDialog = this.reviewDialog.open(ReviewDialogComponent, {
        width: '700px',
        height: '400px',
        data: { rideId: this.ride.id } 
      });
    } else {
      this.snackBar.open("Reviews can only be left up to 3 days after ride has ended.", "Close");
    }
  }

  private checkCanLeaveReview() : boolean {
    // Up to 3 days after the ride has ended
    let tokens = this.ride.endTime.split(" ")
    let dates = tokens[0].split(".")
    let times = tokens[1].split(":")
    let endTime = new Date(+dates[2], +dates[1]-1, +dates[0], +times[0], +times[1])
    let nowTime = new Date()

    let endTimeMilli = endTime.valueOf();
    let threeDaysAfterMilli = endTimeMilli + (1000 * 60 * 60 * 24 * 3)
    let threeDaysAfter = new Date(threeDaysAfterMilli);
    console.log(endTime)
    console.log(threeDaysAfter)
    return nowTime < endTime
  }

}

