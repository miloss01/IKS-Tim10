import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserServiceService } from '../services/user.service';

@Component({
  selector: 'app-driver-vechicle',
  templateUrl: './driver-vechicle.component.html',
  styleUrls: ['./driver-vechicle.component.css']
})
export class DriverVechicleComponent implements OnInit {
  vehicle:Vehicle = {
    id: 0,
    driverId: 0,
    vehicleType: '',
    model: '',
    licenseNumber: '',
    currentLocation: {
      address: '',
      latitude: 0,
      longitude: 0
    },
    passengerSeats: 0,
    babyTransport: false,
    petTransport: false
  }
  changingInformationForm = new FormGroup({
    carName: new FormControl,
    lisencePlate: new FormControl(),
    numberOfSeats: new FormControl(),
  })

  constructor(
    private route:ActivatedRoute,
    private userService: UserServiceService,
  ) {
    
   }

  

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userService
      .getVechicle()
      .subscribe((fetchedVechicle:Vehicle) => {
        this.vehicle =fetchedVechicle; 
        console.log(fetchedVechicle);})
    });
  }

  submitChanges(): void{}

}

export interface Vehicle {
  id: number,
  driverId: number,
  vehicleType: string,
  model: string,
  licenseNumber: string,
  currentLocation: LocationDTO,
  passengerSeats: number;
  babyTransport: boolean,
  petTransport: boolean
}

export interface LocationDTO {
  address: string,
  latitude: number;
  longitude: number;
}
