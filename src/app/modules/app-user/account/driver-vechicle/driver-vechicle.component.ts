import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoginAuthentificationService } from 'src/app/modules/auth/service/login-authentification.service';
import { ManageDriversService } from '../../manage-drivers/service/manage-drivers.service';
import { Vehicle } from 'src/app/models/models';
import { UserServiceService } from '../services/user.service';
import { Output, EventEmitter } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-driver-vechicle',
  templateUrl: './driver-vechicle.component.html',
  styleUrls: ['./driver-vechicle.component.css']
})
export class DriverVechicleComponent implements OnInit {
  @Output() vehicleEvent = new EventEmitter<Vehicle>();
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
    private userAuthentificationService: LoginAuthentificationService) {
    }


  // Is component shown for driver viewing their own account
  isDriver = true;
  

  ngOnInit(): void {
    if (this.userAuthentificationService.getRole() == 2) {
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
        .getVehicleById(this.userAuthentificationService.getId())
        .subscribe((fetchedVechicle:Vehicle) => {
          this.vehicle =fetchedVechicle; 
          console.log("DRIVER VEHICLE COMPONENT - Fetched Vehicle for User with id " + this.userAuthentificationService.getId() +", " + JSON.stringify(fetchedVechicle));})
      });
    }
  }

  toggle(event: MatCheckboxChange){
    console.log(event.source.checked);
    this.vehicle.babyTransport = event.source.checked;
  }

  toggle2(event: MatCheckboxChange){
    this.vehicle.petTransport = event.source.checked;
  }

  saveChanges(): void {
    if (this.changingInformationForm.get('carName')?.value){
      this.vehicle.model = this.changingInformationForm.get('carName')?.value;
    }
    if (this.changingInformationForm.get('lisencePlate')?.value){
      this.vehicle.licenseNumber = this.changingInformationForm.get('lisencePlate')?.value;    }
    if (this.changingInformationForm.get('numberOfSeats')?.value){
      this.vehicle.passengerSeats = this.changingInformationForm.get('numberOfSeats')?.value;
    }
    this.vehicleEvent.emit(this.vehicle);
  }
  
}