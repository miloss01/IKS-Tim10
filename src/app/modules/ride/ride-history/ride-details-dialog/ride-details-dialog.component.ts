import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs';
import { AppUser, AppUserForRide, Ride, RideReview } from 'src/app/models/models';
import { UserServiceService } from 'src/app/modules/app-user/account/services/user.service';
import { MapComponent } from 'src/app/modules/layout/map/map.component';
import { MapService } from 'src/app/modules/layout/services/map.service';
import { ReviewService, RideReviewsDTO } from '../../review/service/review.service';

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
  };

  public reviewsShow : boolean = false;

  public passengersForDisplay : AppUser[] = [];

  public driverForDisplay : AppUser | undefined;
  
  @ViewChild(MapComponent, {static : true}) map : MapComponent | undefined;

  constructor(public dialogRef: MatDialogRef<RideDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private mapService: MapService,
    private reviewService : ReviewService,
    private userService : UserServiceService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) {
      this.ride = data["ride"];
      // SETTING EMAIL FOR DUMMY TESTING TODO - REMOVE
      this.ride.passengers[0].email = "nana@DEsi.com";
  }
  
  forRouteControl = {
    depLat: 0,
    depLon: 0,
    desLat: 0,
    desLon: 0
  };

  ngOnInit(): void {
    this.initMap();
    this.route.params.subscribe((params) => {
      this.reviewService
      .getReviews(this.ride.id)
      .subscribe((fetchedReviews:RideReview[]) => {
        this.review = fetchedReviews[0];
        // SETTING EMAIL FOR DUMMY TESTING TODO - REMOVE
        this.review.driverReview.passenger.email = "nana@DEsi.com";
      });

      this.getDriverForDisplay();
      this.getPassengersForDisplay();


    })
  }
  
  private initMap() {
    this.mapService.postRequest(
      this.ride.locations[0].departure.address, 
      this.ride.locations[0].destination.address,
      undefined,
      undefined,
      undefined)
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

  displayReviews() {
    this.reviewsShow = true;
    if (this.review.driverReview.id==-1) {
      this.snackBar.open("Passenger didn't leave reviews.", "Close");
    }
  }

  getPassengersForDisplay() {
    let user:AppUserForRide;
    for (let i = 0 ; i < this.ride.passengers.length ; i++) {
      user = this.ride.passengers[i];
      this.userService.getUserById(user.id)
      .subscribe((fetchedUser:AppUser) => {
        this.passengersForDisplay.push(fetchedUser);
        })
    }
  }

  getDriverForDisplay() {
    this.userService.getUserById(this.ride.driver.id)
      .subscribe((fetchedUser:AppUser) => {
        this.driverForDisplay = fetchedUser;
        })
  }

}

