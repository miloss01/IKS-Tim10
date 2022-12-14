import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InviteDialogComponent } from '../dialogs/invite-dialog/invite-dialog.component';
import { Location, DepartureDestination, EstimateDataDTO } from 'src/app/models/models';
import { HttpClient } from '@angular/common/http';
import { MapComponent } from '../map/map.component';
import { map, mergeMap, Observable } from 'rxjs';

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
export class BookRideComponent implements OnInit {

  @ViewChild(MapComponent, {static : true}) map : MapComponent | undefined;

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

  vehicleType: string = this.vehicleTypes[0].value;
  petsTransport: boolean = false;
  babyTransport: boolean = false;

  departure: Location = {
    address: '',
    latitude: 0,
    longitude: 0
  }

  destination: Location = {
    address: '',
    latitude: 0,
    longitude: 0
  }

  constructor(public invDialog: MatDialog, private http: HttpClient) { }

  ngOnInit(): void {
  }

  invite(): void {
    const dialogRef = this.invDialog.open(InviteDialogComponent);
  }

  getLatLong(address: string): Observable<any> {
    return this.http.get("https://nominatim.openstreetmap.org/search?format=json&q=" + address);
  }

  postRequest(departureAddress: string, 
              destinationAddress: string, 
              vehicleType: string,
              petsTransport: boolean,
              babyTransport: boolean): Observable<any> {

    let req: EstimateDataDTO = {
      locations: [
        {
          departure: {
            address: departureAddress,
            latitude: 0,
            longitude: 0
          },
          destination: {
            address: destinationAddress,
            latitude: 0,
            longitude: 0
          }
        }
      ],
      vehicleType: vehicleType,
      petTransport: petsTransport,
      babyTransport: babyTransport
    }

    return this.getLatLong(departureAddress)
    .pipe(
      map((res: any) => {
        console.log(res);
        // ovo se mora setovati kao promenljiva u servisu koju prati promenljiva u book ride komponenti
        this.departure.address = departureAddress;
        this.departure.latitude = res[0].lat;
        this.departure.longitude = res[0].lon;
      }),

      mergeMap(() => this.getLatLong(destinationAddress)),
      map((res: any) => {
        console.log(res);
        this.destination.address = destinationAddress;
        this.destination.latitude = res[0].lat;
        this.destination.longitude = res[0].lon;
      }),

      mergeMap(() => this.http.post<string>("http://localhost:8080/api/unregisteredUser", req))
    )
  }

  estimate() {

    this.postRequest(this.estimateDataFormGroup.value.departure, 
                    this.estimateDataFormGroup.value.destination,
                    this.vehicleType,
                    this.petsTransport,
                    this.babyTransport)
    .subscribe((res: any) => {
      console.log(res)

      this.estimated_price = res.estimatedCost;
      
      let routeControl = this.map?.drawRoute(
        // ovi podaci se moraju dobiti iz servisa
        this.departure.latitude,
        this.departure.longitude,
        this.destination.latitude,
        this.destination.longitude
      );

      routeControl.on('routesfound', (e: any) => {
        this.estimated_time = Math.trunc(e.routes[0].summary.totalTime / 60);
      })

    })

  }

}
