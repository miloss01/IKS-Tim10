import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InviteDialogComponent } from '../../layout/dialogs/invite-dialog/invite-dialog.component';
import { Location, DepartureDestination, AppUserForRide, Ride, RideCreation, EstimateDataDTO, RideNotificationDTO } from 'src/app/models/models';
import { HttpClient } from '@angular/common/http';
import { MapComponent } from 'src/app/modules/layout/map/map.component';
import { map, mergeMap, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MapService } from '../../layout/services/map.service';
import * as L from 'leaflet';
import { RideServiceService } from '../service/ride-service.service';
import { UserServiceService } from '../../app-user/account/services/user.service';
import { ManagePassengersService } from '../../app-user/manage-passengers/service/manage-passengers.service';
import { LoginAuthentificationService } from '../../auth/service/login-authentification.service';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RideNotificationService } from '../../app-user/notification/service/ride-notification.service';
import { WebsocketService } from '../service/websocket.service';

interface VehicleType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-book-ride',
  templateUrl: './book-ride.component.html',
  styleUrls: ['./book-ride.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BookRideComponent implements AfterViewInit, OnInit {

  @ViewChild(MapComponent, {static : true}) map : MapComponent | undefined;

  public filterDateFrom: string = "";

  userDate:Date = new Date();
  clickedEstimate:boolean = false;

  isBlocked:boolean= true;

  ride:RideCreation = {
    locations: [],
    startTime: '',
    passengers: [],
    vehicleType: '',
    babyTransport: false,
    petTransport: false,
    estimatedTimeMinutes: 0
  }

  passengers: AppUserForRide[] = [];

  vehicleTypes: VehicleType[] = [
    {value: 'STANDARD', viewValue: 'Standard'},
    {value: 'LUXURY', viewValue: 'Luxury'},
    {value: 'VAN', viewValue: 'Van'},
  ];

  estimateDataFormGroup = new FormGroup({
    departure: new FormControl(),
    destination: new FormControl()
  });

  estimated_time: number | undefined = 0;
  estimated_price: number = 0;
  distance: number = 0;

  vehicleType: string = this.vehicleTypes[0].value;
  petsTransport: boolean = false;
  babyTransport: boolean = false;

  forRouteControl = {
    depLat: 0,
    depLon: 0,
    desLat: 0,
    desLon: 0
  };

  private departureMarker!: L.Marker;
  private destinationMarker!: L.Marker;
  private numOfMarkers: number = 0;

  ngAfterViewInit(): void {
    setTimeout(()=> {
      this.registerOnClick();
    }, 1000);

  }

  locationsFromBookAgain : any | undefined;

  constructor(public invDialog: MatDialog,
    private snackBar: MatSnackBar, 
    private mapService: MapService,
    private rideService: RideServiceService,
    private userService: ManagePassengersService,
    private userAuthentificationService: LoginAuthentificationService,
    private notificationService: RideNotificationService,
    private socketService: WebsocketService,
    private authService: LoginAuthentificationService
    ) { }

  ngOnInit(): void {
    this.rideService.selectedBookAgainValue$.subscribe((value) => {
      this.locationsFromBookAgain = value;
    });
    this.userService.isBlocked(this.userAuthentificationService.getId())
    .subscribe((value) => {
      this.isBlocked = value.blocked;
      console.log(this.isBlocked);
    })
  }

  

  invite(): void {
    const dialogRef = this.invDialog.open(InviteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.passengers = result;
    });
  }

  estimate() {
    this.mapService.postRequest(
      this.estimateDataFormGroup.value.departure, 
      this.estimateDataFormGroup.value.destination)
    .pipe(
      // map((res: any) => {
      //   console.log(res)
      //   this.estimated_price = res.estimatedCost;
      // }),

      mergeMap(() => this.mapService.departureState),
      map((res: any) => {
        console.log(res);
        this.forRouteControl.depLat = res.latitude;
        this.forRouteControl.depLon = res.longitude;
      }),

      mergeMap(() => this.mapService.destinationState),
      map((res: any) => {
        console.log(res);
        this.forRouteControl.desLat = res.latitude;
        this.forRouteControl.desLon = res.longitude;
      })
    )
    .subscribe((res: any) => {

      if (this.departureMarker)
        this.departureMarker.remove();
      if (this.destinationMarker)
        this.destinationMarker.remove();
      this.numOfMarkers = 0;

      let routeControl = this.map?.drawRoute(
        // ovi podaci se moraju dobiti iz servisa
        this.forRouteControl.depLat,
        this.forRouteControl.depLon,
        this.forRouteControl.desLat,
        this.forRouteControl.desLon
      );

      routeControl.on('routesfound', (e: any) => {
        this.estimated_time = Math.trunc(e.routes[0].summary.totalTime / 60);
        this.distance = Math.trunc(e.routes[0].summary.totalDistance / 1000);
        console.log(this.distance);
        

        let req: EstimateDataDTO = {
          locations: [
            {
              departure: {
                address: this.estimateDataFormGroup.value.departure,
                latitude: this.forRouteControl.depLat,
                longitude: this.forRouteControl.depLon
              },
              destination: {
                address: this.estimateDataFormGroup.value.destination,
                latitude: this.forRouteControl.desLat,
                longitude: this.forRouteControl.desLon
              }
            }
          ],
          vehicleType: this.vehicleType,
          petTransport: this.petsTransport,
          babyTransport: this.babyTransport,
          distance: this.distance
        }

        this.mapService.estimateData(req).subscribe((res: any) => {
          console.log(res);
          this.estimated_price = res.estimatedCost;
          this.clickedEstimate = true;
        })
      })
    })

  }

  registerOnClick(): void {
    this.map?.getMap().on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      this.mapService.getAddressFromLatLong(lat, lng).subscribe((res) => {

        let rc = this.map?.getMap().routeControl;
        console.log(rc);
        if (rc) {
          rc.removeFrom(this.map?.getMap());
        }
        
        let street = res.address.road;
        let houseNumber = res.address.house_number ? " " + res.address.house_number : "";
        let city = res.address.city_district;

        let full = `${street}${houseNumber}, ${city}`;
        console.log(full);
        
        if (this.numOfMarkers == 0) {
          this.departureMarker = new L.Marker([lat, lng]).addTo(this.map?.getMap());
          this.estimateDataFormGroup.patchValue({ departure: full });
        } else if (this.numOfMarkers == 1) {
          this.destinationMarker = new L.Marker([lat, lng]).addTo(this.map?.getMap());
          this.estimateDataFormGroup.patchValue({ destination: full });
        } else {
          this.departureMarker.removeFrom(this.map?.getMap());
          this.destinationMarker.removeFrom(this.map?.getMap());
          this.numOfMarkers = -1;
        }

        this.numOfMarkers += 1;
        
      });
      
    });
  }

  bookRide():void{
    // if (this.estimated_time == 0 || this.estimated_time==undefined) {
    //   this.estimate();
    // }
    if(this.isBlocked) {
      Swal.fire({title: 'Ride cant be booked', 
      text: 'You are blocked and do to our security policy can not book a ride.', 
      icon: 'error'});
      return;
    }
    this.continueBooking();
    
  }

  addPrefrences() {
    this.ride.vehicleType = this.vehicleType.toLowerCase();
    this.ride.babyTransport = this.babyTransport;
    this.ride.petTransport = this.petsTransport;
  }
  addTime() :boolean{
    console.log(this.filterDateFrom);
    console.log(new Date(this.filterDateFrom));
    if (!this.filterDateFrom){return false;}
    this.userDate = new Date(this.filterDateFrom);
    let miliseconds:number = this.userDate.valueOf() - (new Date()).valueOf();
    if (miliseconds > 18000000 || miliseconds < 0) {return false;}
    this.filterDateFrom.replace("T", " ")
    this.ride.startTime = this.filterDateFrom;
    return true;
  }
  addPeople() {
    this.passengers.push({id: this.userAuthentificationService.getId(), email:this.userAuthentificationService.getEmail()});
    //other users were added when the dialog closed
    this.ride.passengers = this.passengers;
  }

  continueBooking() {
    if (!this.estimateDataFormGroup.value.departure || !this.estimateDataFormGroup.value.destination){
      this.snackBar.open("Please enter locations", "Close");
      return;}
    if (this.estimated_price == 0 || !this.clickedEstimate) {
      this.snackBar.open("Please click estimate", "Close");
      return;
    }
      this.ride.locations = [{
        departure:{
        address: this.estimateDataFormGroup.value.departure,
        latitude: this.forRouteControl.depLat,
        longitude: this.forRouteControl.depLon
      }, 
      destination:{
        address: this.estimateDataFormGroup.value.destination,
        latitude: this.forRouteControl.desLat,
        longitude: this.forRouteControl.depLon
      }
    }]
      if (!this.addTime()){
        this.snackBar.open("Time not valid", "Close");
        return;}
      this.addPrefrences();
      this.addPeople();
      this.ride.estimatedTimeMinutes= this.estimated_time || 0;
      
      Swal.fire({title: 'Ride request sent', 
      text: 'We will update you with booking information.', 
      footer: '<a href="current-ride">View ride status and details.</a>',
      timer: 2000,
      timerProgressBar: true});
      this.clickedEstimate = false;
      
      this.rideService.addRide(this.ride).subscribe((value) => {
          if (value == null) this.notificationService.alertNotAvailable()
        }, (error: Error) => {
          this.notificationService.alertAlreadyPending();
        });
  }

}


