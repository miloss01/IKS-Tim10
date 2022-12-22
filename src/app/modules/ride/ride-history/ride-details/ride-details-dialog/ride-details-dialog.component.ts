import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs';
import { Ride } from 'src/app/models/models';
import { MapComponent } from 'src/app/modules/layout/map/map.component';
import { MapService } from 'src/app/modules/layout/services/map.service';

@Component({
  selector: 'app-ride-details-dialog',
  templateUrl: './ride-details-dialog.component.html',
  styleUrls: ['./ride-details-dialog.component.css']
})
export class RideDetailsDialogComponent implements OnInit {

  public ride : Ride;

  @ViewChild(MapComponent, {static : true}) map : MapComponent | undefined;

  constructor(public dialogRef: MatDialogRef<RideDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private mapService: MapService,
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
