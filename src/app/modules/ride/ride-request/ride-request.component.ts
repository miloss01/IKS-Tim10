import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { map, mergeMap } from 'rxjs'
import { Ride } from 'src/app/models/models'
import { CancelDialogComponent } from '../../layout/dialogs/cancel-dialog/cancel-dialog.component'
import { MapComponent } from '../../layout/map/map.component'
import { MapService } from '../../layout/services/map.service'
import { RideServiceService } from '../service/ride-service.service'

@Component({
  selector: 'app-ride-request',
  templateUrl: './ride-request.component.html',
  styleUrls: ['./ride-request.component.css']
})
export class RideRequestComponent implements OnInit {
  @ViewChild(MapComponent, { static: true }) map: MapComponent | undefined

  ride: Ride = {
    id: 0,
    locations: [],
    startTime: '',
    endTime: '',
    totalCost: 0,
    driver: { id: 0, email: '' },
    passengers: [],
    estimatedTimeInMinutes: 0
  }

  forRouteControl = {
    depLat: 0,
    depLon: 0,
    desLat: 0,
    desLon: 0
  }

  constructor (public declineDialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly rideService: RideServiceService,
    private readonly router: Router,
    private readonly mapService: MapService) { }

  ngOnInit (): void {
    this.route.params.subscribe((params) => {
      this.rideService
        .getRideById(1)
        .subscribe((fetcedRide: Ride) => {
          this.ride = fetcedRide
          console.log(fetcedRide)

          this.mapService.postRequest(
            this.ride.locations[0].departure.address, 
            this.ride.locations[0].destination.address)
            .pipe(
              // map((res: any) => {
              //   console.log(res)
              //   //this.estimated_price = res.estimatedCost;
              // }),

              mergeMap(() => this.mapService.departureState),
              map((res: any) => {
                console.log(res)
                this.forRouteControl.depLat = this.ride.locations[0].departure.latitude
                this.forRouteControl.depLon = this.ride.locations[0].departure.longitude
              }),

              mergeMap(() => this.mapService.destinationState),
              map((res: any) => {
                console.log(res)
                this.forRouteControl.desLat = this.ride.locations[0].destination.latitude
                this.forRouteControl.desLon = this.ride.locations[0].destination.longitude
              })
            )
            .subscribe((res: any) => {
              const routeControl = this.map?.drawRoute(
                // ovi podaci se moraju dobiti iz servisa
                this.forRouteControl.depLat,
                this.forRouteControl.depLon,
                this.forRouteControl.desLat,
                this.forRouteControl.desLon
              );

              routeControl.on('routesfound', (e: any) => {

                // this.estimated_time = Math.trunc(e.routes[0].summary.totalTime / 60);
              })
            })
        })
    })

    // drawRoutes();
  }

  /* getLatLong(address: string): Observable<any> {
    return this.http.get("https://nominatim.openstreetmap.org/search?format=json&q=" + address);
  } */

  acceptRide (): void {
    if (this.ride.id === undefined) { return }
    this.rideService
      .acceptRideById(this.ride.id)
      .subscribe((res: any) => {
        console.log(res)
        void this.router.navigate(['current-ride'])
      })
  }

  declineRide (): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dialogRef = this.declineDialog.open(CancelDialogComponent, {
      data: { rideId: this.ride.id }
    })
  }
}
