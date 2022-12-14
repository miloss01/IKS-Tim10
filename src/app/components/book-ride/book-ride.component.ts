import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InviteDialogComponent } from '../dialogs/invite-dialog/invite-dialog.component';
import { Location, DepartureDestination, EstimateDataDTO } from 'src/app/models/models';
import { HttpClient } from '@angular/common/http';
import { MapComponent } from '../map/map.component';

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

  constructor(public invDialog: MatDialog, private http: HttpClient) { }

  ngOnInit(): void {
  }

  invite(): void {
    const dialogRef = this.invDialog.open(InviteDialogComponent);
  }

  estimate() {

    let departure: Location = {
      address: this.estimateDataFormGroup.value.departure,
      latitude: 0,
      longitude: 0
    };

    let destination: Location = {
      address: this.estimateDataFormGroup.value.destination,
      latitude: 0,
      longitude: 0
    }

    let departureDestination: DepartureDestination = {
      departure: departure,
      destination: destination
    };

    let req: EstimateDataDTO = {
      locations: [departureDestination],
      vehicleType: this.vehicleType,
      petTransport: this.petsTransport,
      babyTransport: this.babyTransport
    };

    this.http.get("https://nominatim.openstreetmap.org/search?format=json&q=" + this.estimateDataFormGroup.value.departure)
    .subscribe((res: any) => {
      console.log(res);
      req.locations[0].departure.latitude = res[0].lat;
      req.locations[0].departure.longitude = res[0].lon;

      this.http.get("https://nominatim.openstreetmap.org/search?format=json&q=" + this.estimateDataFormGroup.value.destination)
      .subscribe((res: any) => {
        console.log(res);
        req.locations[0].destination.latitude = res[0].lat;
        req.locations[0].destination.longitude = res[0].lon;

        this.http.post<string>("http://localhost:8080/api/unregisteredUser", req)
        .subscribe((res: any) => {
          // this.estimated_time = res.estimatedTimeInMinutes;
          this.estimated_price = res.estimatedCost;

          let routeControl = this.map?.drawRoute(
            req.locations[0].departure.latitude,
            req.locations[0].departure.longitude,
            req.locations[0].destination.latitude,
            req.locations[0].destination.longitude
          );

          routeControl.on('routesfound', (e: any) => {
            this.estimated_time = Math.trunc(e.routes[0].summary.totalTime / 60);
          })

        });

      })

    })
  }

}
