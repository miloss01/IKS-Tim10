import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs';
import { AppUser, AppUserForRide, Ride, RideReview } from 'src/app/models/models';
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
      passenger: {id:-1, email: "YYYYYYYYYYYYY"}
    },
    vehicleReview: {
      id: -1,
      rating: -1,
      comment: "",
      passenger: {id:-1, email: "XXXXXXXXXXX"}
    }
  };

  @ViewChild(MapComponent, {static : true}) map : MapComponent | undefined;

  constructor(public dialogRef: MatDialogRef<RideDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private mapService: MapService,
    private reviewService : ReviewService,
    private route: ActivatedRoute) {
      this.ride = data["ride"];
  }
  
  forRouteControl = {
    depLat: 0,
    depLon: 0,
    desLat: 0,
    desLon: 0
  };

  ngOnInit(): void {
    this.initMap();
    this.ride.passengers[0].email = "em@ail.com";
    this.route.params.subscribe((params) => {
      this.reviewService
      .getReviews(this.ride.id)
      .subscribe((fetchedReviews:RideReview[]) => {
        console.log("evo ga reviewdto" + JSON.stringify(fetchedReviews));
        this.review = fetchedReviews[0];
        console.log("evo ga review" + JSON.stringify(this.review));
        })
    });
  }
  
  private initMap() {
    console.log(JSON.stringify(this.ride));
    this.mapService.postRequest(
      this.ride.locations[0].departure.address, 
      this.ride.locations[0].destination.address,
      undefined,
      undefined,
      undefined)
    .pipe(
      mergeMap(() => this.mapService.departureState),
      map((res: any) => {
        console.log(res);
        this.forRouteControl.depLat = this.ride.locations[0].departure.latitude;
        this.forRouteControl.depLon = this.ride.locations[0].departure.longitude;
      }),

      mergeMap(() => this.mapService.destinationState),
      map((res: any) => {
        console.log(res);
        this.forRouteControl.desLat = this.ride.locations[0].destination.latitude;
        this.forRouteControl.desLon = this.ride.locations[0].destination.longitude;
      })
    )
    .subscribe((res: any) => {
      console.log(JSON.stringify(this.forRouteControl));
      let routeControl = this.map?.drawRoute(
        // ovi podaci se moraju dobiti iz servisa
        this.forRouteControl.depLat,
        this.forRouteControl.depLon,
        this.forRouteControl.desLat,
        this.forRouteControl.desLon
      );
    })
  }

}

