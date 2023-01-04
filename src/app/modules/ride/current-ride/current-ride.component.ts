import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs';
import { EstimateDataDTO, LocationDTO, Ride } from 'src/app/models/models';
import { MapComponent } from '../../layout/map/map.component';
import { MapService } from '../../layout/services/map.service';
import { RideServiceService } from '../service/ride-service.service';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { LoginAuthentificationService } from '../../auth/service/login-authentification.service';
import * as L from 'leaflet';
import { WebsocketService } from '../service/websocket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-current-ride',
  templateUrl: './current-ride.component.html',
  styleUrls: ['./current-ride.component.css']
})
export class CurrentRideComponent implements AfterViewInit {

  @ViewChild(MapComponent, {static : true}) map : MapComponent | undefined;

  destination: string = "";
  time_elapsed: number = 0;
  estimated_minutes_left: number = 0;
  kilometers_travelled: number = 0;
  estimated_price: number = 0;
  distance: number = 0;
  coordinates: L.LatLng[] = [];
  routeMarker!: L.Marker;

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
    private authService: LoginAuthentificationService,
    private route: ActivatedRoute,
    private rideService: RideServiceService,
    private socketService: WebsocketService) { }

  ngAfterViewInit(): void {

    let userId = this.authService.getId();
    let userRole = this.authService.getRole();
    console.log(userRole);

    if (userRole == "DRIVER") 
      this.rideService
      .getActiveDriverRide(userId)
      .subscribe(
        (response: any) => {
          this.ride = response.body!;
          this.initMap();
      },
        (error: any) => {
          alert("No active ride");
        }
      );
    else if (userRole == "PASSENGER")
      this.rideService
        .getActivePassengerRide(userId)
        .subscribe(
          (response: any) => {
            this.ride = response.body!;
            this.initMap();
        },
          (error: any) => {
            alert("No active ride");
          }
        );

    let stompClient: any = this.socketService.initWebSocket();
    stompClient.connect({}, () => {
      console.log("u connect");

      stompClient.subscribe("/vehicle-location", (message: { body: string }) => {
        
        let location: LocationDTO = JSON.parse(message.body);
        console.log(location);
        console.log("dobio sa socketa");

        this.moveMarker(location);

      });

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
        this.coordinates = e.routes[0].coordinates;
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

  moveMarker(location: LocationDTO): void {
    if (this.routeMarker)
        this.routeMarker.removeFrom(this.map?.getMap());
    this.routeMarker = new L.Marker([location.latitude, location.longitude]).addTo(this.map?.getMap());
    console.log("pomerio marker");
  }

  showMarkers(i: number): void {
      
    setTimeout(() => {
      
      let lat = this.coordinates[i].lat;
      let lng = this.coordinates[i].lng;

      // dobiti adresu od lokacije
      this.mapService.getAddressFromLatLong(lat, lng).subscribe((res: any) => {
        let street = res.address.road;
        let houseNumber = res.address.house_number ? " " + res.address.house_number : "";
        let city = res.address.city_district;

        let full = `${street}${houseNumber}, ${city}`;

        let data: LocationDTO = {
          address: full,
          latitude: lat,
          longitude: lng
        }

        this.rideService.getVehicleOfDriver(this.ride.driver.id).subscribe((res: any) => {
          let vehicleId = res.id;

          this.http.put(environment.apiHost + "vehicle/" + vehicleId + "/location", data).subscribe((res: any) => {
            i += 20;
    
            if (i > this.coordinates.length)
              return;
      
            this.showMarkers(i);
            console.log("poslao na bek");
          });

        })

      })

      this.time_elapsed += 2;

    }, 2000);
  }

  showMarkerssss(): void {
    this.showMarkers(0);
  }
  

}
