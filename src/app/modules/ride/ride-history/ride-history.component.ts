import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ride } from 'src/app/models/models';
import { RideServiceService } from '../service/ride-service.service';

@Component({
  selector: 'app-ride-history',
  templateUrl: './ride-history.component.html',
  styleUrls: ['./ride-history.component.css']
})
export class RideHistoryComponent implements OnInit {

  rides: Ride[] = [];

  constructor(private route: ActivatedRoute,
    private rideService: RideServiceService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.rideService
      .getAllPassengerRides(1)
      .subscribe((res:ridesDTO) => {
        this.rides = res.results;
        })
    });
  }

}

export interface ridesDTO{
  totalCount: number,
  results: Ride[]
}
