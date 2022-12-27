import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InviteDialogComponent } from '../../layout/dialogs/invite-dialog/invite-dialog.component';
import { Location, DepartureDestination, EstimateDataDTO } from 'src/app/models/models';
import { HttpClient } from '@angular/common/http';
import { MapComponent } from 'src/app/modules/layout/map/map.component';
import { map, mergeMap, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MapService } from '../../layout/services/map.service';
import * as L from 'leaflet';
import { RideServiceService } from '../service/ride-service.service';

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
    private mapService: MapService,
    private rideService: RideServiceService) { }

  ngOnInit(): void {
    this.rideService.selectedBookAgainValue$.subscribe((value) => {
      this.locationsFromBookAgain = value;
    });
  }

  

  invite(): void {
    const dialogRef = this.invDialog.open(InviteDialogComponent);
  }

  estimate() {

    this.mapService.postRequest(
      this.estimateDataFormGroup.value.departure, 
      this.estimateDataFormGroup.value.destination,
      this.vehicleType,
      this.petsTransport,
      this.babyTransport)
    .pipe(
      map((res: any) => {
        console.log(res)
        this.estimated_price = res.estimatedCost;
      }),

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

}
