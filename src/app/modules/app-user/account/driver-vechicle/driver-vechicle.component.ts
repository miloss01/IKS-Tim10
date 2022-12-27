import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Vehicle } from 'src/app/models/models';
import { LoginAuthentificationService } from 'src/app/modules/auth/service/login-authentification.service';
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
    private userAuthentificationService: LoginAuthentificationService) {
    
   }

  

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userService
      .getVechicle(this.userAuthentificationService.getId())
      .subscribe((fetchedVechicle:Vehicle) => {
        this.vehicle =fetchedVechicle; 
        console.log(fetchedVechicle);})
    });
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