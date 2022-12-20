import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Ride } from 'src/app/models/models';
import { UserServiceService } from '../../app-user/account/services/user.service';
import { CancelDialogComponent } from '../../layout/dialogs/cancel-dialog/cancel-dialog.component';
import { MapComponent } from '../../layout/map/map.component';
import { RideServiceService } from '../service/ride-service.service';

@Component({
  selector: 'app-ride-request',
  templateUrl: './ride-request.component.html',
  styleUrls: ['./ride-request.component.css']
})
export class RideRequestComponent implements OnInit {
  @ViewChild(MapComponent, {static : true}) map : MapComponent | undefined;

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

  constructor(public declineDialog: MatDialog, private http: HttpClient,
    private route:ActivatedRoute,
    private rideService: RideServiceService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.rideService
      .getRideById(1)
      .subscribe((fetcedRide:Ride) => {
        this.ride =fetcedRide; 
        })
    });
  }


  getLatLong(address: string): Observable<any> {
    return this.http.get("https://nominatim.openstreetmap.org/search?format=json&q=" + address);
  }

  acceptRide(): void {
    this.rideService
    .acceptRideById(this.ride.id)
    .subscribe((res: any) => {
        console.log(res);
        this.router.navigate(['current-ride']); //TODO chage navigation
    });
  }

  declineRide(): void {
    const dialogRef = this.declineDialog.open(CancelDialogComponent, {
      data: {rideId: this.ride.id}
    });
  }

}
