import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs';
import { EstimateDataDTO, LocationDTO, RideNotificationDTO, Ride } from 'src/app/models/models';
import { MapComponent } from '../../layout/map/map.component';
import { MapService } from '../../layout/services/map.service';
import { RideServiceService } from '../service/ride-service.service';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { LoginAuthentificationService } from '../../auth/service/login-authentification.service';
import * as L from 'leaflet';
import { WebsocketService } from '../service/websocket.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ridesDTO } from '../ride-history/ride-history.component';
import { RideNotificationService } from '../../app-user/notification/service/ride-notification.service';

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
    estimatedTimeInMinutes: 0,
  }

  status: string = ""

  forRouteControl = {
    depLat: 0,
    depLon: 0,
    desLat: 0,
    desLon: 0
  };

  redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  constructor(private http: HttpClient, 
    private mapService: MapService,
    private authService: LoginAuthentificationService,
    private route: ActivatedRoute,
    private rideService: RideServiceService,
    private socketService: WebsocketService,
    private notificationService: RideNotificationService) { }

  userRole: string = "";
  userId: number = -1;

  ngAfterViewInit(): void {

    this.userId = this.authService.getId();
    this.userRole = this.authService.getRole();

    this.notificationService.updatedValue$.subscribe((res) => {
      this.updateViewToRide();
    })

    this.initializeViewRide();
    
    let stompClient: any = this.socketService.initWebSocket();
    stompClient.connect({}, () => {

      stompClient.subscribe("/vehicle-location", (message: { body: string }) => {
        
        let location: LocationDTO = JSON.parse(message.body);

        this.moveMarker(location);

      });

    });

  }

  // private initializeForPassenger (userId: number): void {
  //   this.rideService
  //     .getActivePassengerRide(userId)
  //     .subscribe(
  //       (response: any) => {
  //         this.ride = response.body!;
  //         this.status = response.body!.status;
  //         this.initMap();
  //     });

  //   this.rideService.getAcceptedPassengerRide(userId).subscribe((response: any) => {
  //     this.ride = response.body!;
  //     this.status = response.body!.status;
  //   })

  //   this.rideService.getPendingPassengerRide(userId).subscribe((response: any) => {
  //     this.ride = response.body!;
  //     this.status = response.body!.status;
  //   })

  // }

  // private initializeForDriver (userId: number): void {
    
  //   this.rideService.getActiveDriverRide(userId).subscribe(
  //     (response: any) => {
  //       this.ride = response.body!;
  //       this.status = response.body!.status;
  //       this.initMap();
  //   })

  //   this.rideService.getAcceptedDriverRide(userId).subscribe((response: any) => {
  //     this.ride = response.body!;
  //     this.status = response.body!.status;
  //   })

  //   this.rideService.getPendingDriverRide(userId).subscribe((response: any) => {
  //     this.ride = response.body!;
  //     this.status = response.body!.status;
  //     this.alertRideRequest(response.body);
  //   })
    
  // }

  private initializeViewRide() {
    this.checkPendingRide(this.userRole);
    this.checkAcceptedRide(this.userRole);
    this.checkActiveRide(this.userRole);
  }

  checkActiveRide(role: string): void {
    if (role === 'DRIVER') {
      this.rideService.getActiveDriverRide(this.userId).subscribe(
        (response: any) => {
          this.ride = response.body!;
          this.status = response.body!.status;
          this.initMap();
      })
    } else if (role === 'PASSENGER') {
      this.rideService
      .getActivePassengerRide(this.userId)
      .subscribe(
        (response: any) => {
          this.ride = response.body!;
          this.status = response.body!.status;
          this.initMap();
      });
    }
  }

  checkPendingRide(role: string): void {
    if (role === 'DRIVER') {
      this.rideService.getPendingDriverRide(this.userId).subscribe((response: any) => {
        this.ride = response.body!;
        this.status = response.body!.status;
        this.alertRideRequest(response.body);
        this.initMap();
      })
    } else if (role === 'PASSENGER') {
      this.rideService.getPendingPassengerRide(this.userId).subscribe((response: any) => {
        this.ride = response.body!;
        this.status = response.body!.status;
        this.initMap();
      })
  }}
  
  checkAcceptedRide(role: string): void {
    if (role === 'DRIVER') {
      this.rideService.getAcceptedDriverRide(this.userId).subscribe((response: any) => {
        this.ride = response.body!;
        this.status = response.body!.status;
        this.initMap();
      })
    } else if (role === 'PASSENGER') {
      this.rideService.getAcceptedPassengerRide(this.userId).subscribe((response: any) => {
        this.ride = response.body!;
        this.status = response.body!.status;
        this.initMap();
      })
    }
  }


  startRide (): void {
    this.rideService.startRide(this.ride.id).subscribe(
      (response: any) => {
        this.checkActiveRide(this.userRole);
      }
    )
  }

  acceptRide (): void {
    this.rideService.acceptRideById(this.ride.id).subscribe(
      (response: any) => {
        this.checkAcceptedRide(this.userRole);
        this.notificationService.snackRideAccepted();
      }
    )
  }

  cancelRide (): void {
    this.rideService.cancelRide({"reason": "not rn"}, this.ride.id).subscribe(
      (response: any) => {
        console.log("declined ride");
        this.notificationService.snackRideDeclined();
        this.resetToNoRide();
      }
    )
  }

  withdrawRide (): void {
    this.rideService.withdrawRideById(this.ride.id).subscribe(
      (response: any) => {
        this.notificationService.snackRideDeclined();
        this.resetToNoRide();
      }
    )
  }


  endRide() {
    this.rideService.endRide(this.ride.id)
    .subscribe((res: any) => {
        console.log(res);

        this.resetToNoRide();
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'success',
          title: 'Ride ended.'
        })
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
    this.routeMarker = new L.Marker([location.latitude, location.longitude], {icon: this.redIcon}).addTo(this.map?.getMap());
  }

  showMarkers(i: number): void {

    if (i > this.coordinates.length - 1)
      return
      
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
            // i += 20;
            console.log(`${i} od ${this.coordinates.length}`)
    
            if (i > this.coordinates.length - 1 - 20 && i < this.coordinates.length - 1) {
              this.showMarkers(this.coordinates.length - 1);
              console.log(`iz if-a ${i} od ${this.coordinates.length}`)
            } else {
              this.showMarkers(i + 20);
              console.log("poslao na bek");
            }
      
          });

        })

      })

      this.time_elapsed += 2;
      this.kilometers_travelled = Number((this.kilometers_travelled + 0.9).toFixed(2));

    }, 2000);
  }

  showMarkerssss(): void {
    this.showMarkers(0);
  }
  
  private alertRideRequest(ride: Ride): void {
    Swal.fire({
      title: 'Ride request',
      html: '<p>From <b>'+ ride.locations[0].departure.address + '</b> to <b>' + ride.locations[0].destination.address + '</b> </p>' 
      + '<p>With estimated time: <b>' + ride.estimatedTimeInMinutes +' minutes</b></p>'
      + '<p>Estimated cost: <b>' + ride.totalCost + ' RSD</b></p>',
      showDenyButton: true,
      confirmButtonText: 'Accept',
      denyButtonText: `Decline`,
      confirmButtonColor: '#24ED80',
      denyButtonColor: '#ff4625',
    }).then((result) => {
      if (result.isConfirmed) {
        this.rideService.acceptRideById(ride.id).subscribe(
           (response: any) => {
             console.log('accepted ride' + response);
             this.checkAcceptedRide(this.userRole);
             this.notificationService.snackRideAccepted();
        });;
      } else if (result.isDenied) {
        this.rideService.cancelRide({"reason": "not rn"}, ride.id).subscribe(
          (response: any) => {
            console.log("declined ride");
            this.notificationService.snackRideDeclined();
            this.resetToNoRide();
          }
        )
      }
    })
  }

  

  private resetToNoRide (): void {
    this.status = ""
    this.ride = {
      id: 0,
      locations: [],
      startTime: '',
      endTime: '',
      totalCost: 0,
      driver: {id:0, email:""},
      passengers: [],
      estimatedTimeInMinutes: 0,
    }
  }

  private updateViewToRide (): void {
    this.resetToNoRide();
    this.initializeViewRide();
  }

}

