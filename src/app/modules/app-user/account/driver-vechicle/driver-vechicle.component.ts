import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoginAuthentificationService } from 'src/app/modules/auth/service/login-authentification.service';
import { ManageDriversService } from '../../manage-drivers/service/manage-drivers.service';
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
    private manageDrivers: ManageDriversService,
    private authService: LoginAuthentificationService
  ) {
    
   }

  // Is component shown for driver viewing their own account
  isDriver = true;
  

  ngOnInit(): void {
    if (this.authService.getRole() == 2) {
      this.userService.selectedValue$.subscribe((value) => {
        this.route.params.subscribe((params) => {
          this.userService
          .getVehicleById(value)
          .subscribe((fetchedVechicle:Vehicle) => {
            this.vehicle =fetchedVechicle; 
            console.log("DRIVER VEHICLE COMPONENT - Fetched Vehicle for User with id " + value +", " + JSON.stringify(fetchedVechicle));})
        });
      })
      this.isDriver = false;
    } else {
      this.route.params.subscribe((params) => {
        this.userService
        .getVehicleById(this.authService.getId())
        .subscribe((fetchedVechicle:Vehicle) => {
          this.vehicle =fetchedVechicle; 
          console.log("DRIVER VEHICLE COMPONENT - Fetched Vehicle for User with id " + this.authService.getId() +", " + JSON.stringify(fetchedVechicle));})
      });
    }
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
