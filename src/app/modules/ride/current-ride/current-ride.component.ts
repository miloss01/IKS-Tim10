import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs';
import { EstimateDataDTO, Ride } from 'src/app/models/models';
import { MapComponent } from '../../layout/map/map.component';
import { MapService } from '../../layout/services/map.service';
import { RideServiceService } from '../service/ride-service.service';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';

@Component({
  selector: 'app-current-ride',
  templateUrl: './current-ride.component.html',
  styleUrls: ['./current-ride.component.css']
})
export class CurrentRideComponent implements OnInit {

  @ViewChild(MapComponent, {static : true}) map : MapComponent | undefined;

  destination: string = "";
  time_elapsed: number = 0;
  estimated_minutes_left: number = 0;
  kilometers_travelled: number = 0;
  estimated_price: number = 0;
  distance: number = 0;

  ride:Ride = {
    id: 0,
    locations: [],
    startTime: '',
    endTime: '',
    totalCost: 0,
    driver: {id:0, email:""},
    passengers: [],
    estimatedTimeInMinutes: 0
  }

  forRouteControl = {
    depLat: 0,
    depLon: 0,
    desLat: 0,
    desLon: 0
  };

  constructor(private http: HttpClient, 
    private mapService: MapService,
    private route: ActivatedRoute,
    private rideService: RideServiceService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.rideService
      .getActiveDriverRide(1)
      .subscribe((ride:Ride) => {
        this.ride = ride; 
        this.initMap();
      })
    });

  }

  endRide() {
    this.rideService.endRide(this.ride.id)
    .subscribe((res: any) => {
        console.log(res);
    });
  }

  panicRide() {
    this.rideService.raisePanic(this.ride.id)
    .subscribe((res: any) => {
      console.log(res);
  });
  }

  private initMap() {
    this.mapService.postRequest(
      this.ride.locations[0].departure.address, 
      this.ride.locations[0].destination.address)
    .pipe(
      // map((res: any) => {
      //   console.log(res)
      //   this.estimated_price = res.estimatedCost;
      // }),

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

      routeControl.on('routesfound', (e: any) => {
        this.estimated_minutes_left = Math.trunc(e.routes[0].summary.totalTime / 60);
        this.distance = Math.trunc(e.routes[0].summary.totalDistance / 1000);
        console.log(this.distance);

        let req: EstimateDataDTO = {
          locations: [
            {
              departure: {
                address: this.ride.locations[0].departure.address,
                latitude: this.forRouteControl.depLat,
                longitude: this.forRouteControl.depLon
              },
              destination: {
                address: this.ride.locations[0].destination.address,
                latitude: this.forRouteControl.desLat,
                longitude: this.forRouteControl.desLon
              }
            }
          ],
          vehicleType: undefined,
          petTransport: undefined,
          babyTransport: undefined,
          distance: this.distance
        }

        this.mapService.estimateData(req).subscribe((res: any) => {
          console.log(res);
          this.estimated_price = res.estimatedCost;
        })
      })
    })
  }


  

}
