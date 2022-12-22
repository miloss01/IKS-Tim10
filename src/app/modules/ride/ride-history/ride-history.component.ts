import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Ride } from 'src/app/models/models';
import { RideServiceService } from '../service/ride-service.service';
import { RideDetailsDialogComponent } from './ride-details/ride-details-dialog/ride-details-dialog.component';

@Component({
  selector: 'app-ride-history',
  templateUrl: './ride-history.component.html',
  styleUrls: ['./ride-history.component.css']
})
export class RideHistoryComponent implements OnInit {

  rides: Ride[] = [];

  constructor(private route: ActivatedRoute,
    private rideService: RideServiceService,
    public rideDetailsDialog: MatDialog,) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.rideService
      .getAllPassengerRides(1)
      .subscribe((res:ridesDTO) => {
        this.rides = res.results;
        })
    });
  }

  viewRideDetails(ride : Ride) {
    const rideDetailsDialog = this.rideDetailsDialog.open(RideDetailsDialogComponent, {
      width: '900px',
      height: '500px',
      data: { ride: ride }
    });
  }

}

export interface ridesDTO{
  totalCount: number,
  results: Ride[]
}
