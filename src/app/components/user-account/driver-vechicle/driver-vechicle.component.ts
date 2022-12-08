import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-driver-vechicle',
  templateUrl: './driver-vechicle.component.html',
  styleUrls: ['./driver-vechicle.component.css']
})
export class DriverVechicleComponent implements OnInit {
  imageSrc: string;
  averageGrade: number;
  carName: string;
  lisencePlate: string;
  numberOfSeats: number;
  babySeat: boolean;
  petsAllowed: boolean;
  changingInformationForm = new FormGroup({
    carName: new FormControl,
    lisencePlate: new FormControl(),
    numberOfSeats: new FormControl(),
  })

  constructor() {
    this.imageSrc = "https://www.magazinauto.com/wp-content/uploads/2020/09/IMG_3305-e1600082024266-680x365.jpg";
    this.averageGrade = 4.5;
    this.carName = "Honda Civic V59";
    this.lisencePlate = "599 23-IO"
    this.numberOfSeats = 5;
    this.babySeat = true;
    this.petsAllowed = false;
    this.changingInformationForm.setValue({
      carName: this.carName,
      lisencePlate: this.lisencePlate,
      numberOfSeats: this.numberOfSeats,
    });
   }

  

  ngOnInit(): void {
  }

  submitChanges(): void{}

}
