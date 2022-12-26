import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUser, DriverDTO, VehicleDTO, VehicleType } from 'src/app/models/models';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-register-driver',
  templateUrl: './register-driver.component.html',
  styleUrls: ['./register-driver.component.css']
})
export class RegisterDriverComponent implements OnInit {

  vehicleTypes: VehicleType[] = [
    {value: 'STANDARD', viewValue: 'Standard'},
    {value: 'LUXURY', viewValue: 'Luxury'},
    {value: 'VAN', viewValue: 'Van'},
  ];

  registerDriverForm = new FormGroup( {
    name: new FormControl(),
    lastName: new FormControl(),
    phone: new FormControl(),
    address: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),

    model: new FormControl(),
    registrationPlate: new FormControl(),
    type: new FormControl(this.vehicleTypes[0].value),
    seats: new FormControl(),
    pets: new FormControl(),
    kids: new FormControl()
  })

  constructor(private router: Router, private appUserService: AppUserService) { }

  ngOnInit(): void {
  }

  registerDriver(): void {
    console.log("Value of form: " + JSON.stringify(this.registerDriverForm.value));

    let driver: DriverDTO = {
      id: null,
      name: this.registerDriverForm.value.name,
      surname: this.registerDriverForm.value.lastName,
      telephoneNumber: this.registerDriverForm.value.phone,
      email: this.registerDriverForm.value.email,
      address: this.registerDriverForm.value.address,
      profilePicture: "",
      password: this.registerDriverForm.value.password
    }

    let vehicle: VehicleDTO = {
      id: null,
      driverId: null,
      vehicleType: this.registerDriverForm.value.type!,
      model: this.registerDriverForm.value.model,
      licenseNumber: this.registerDriverForm.value.registrationPlate,
      currentLocation: {
        address: "Strazilovska 20, novi sad",
        latitude: 45.2501342,
        longitude: 19.8480507
      },
      passengerSeats: this.registerDriverForm.value.seats,
      babyTransport: this.registerDriverForm.value.kids,
      petTransport: this.registerDriverForm.value.pets
    }

    console.log(driver);
    console.log(vehicle);

    this.appUserService.addDriver(driver).subscribe((res: any) => {
      console.log(res);
      this.appUserService.setDriverVehicle(Number(res.id), vehicle).subscribe((res: any) => {
        console.log(res);
      });
    });

      // this.appUserService
      // .addPassenger(this.registerDriverForm.value)
      // .subscribe((res: any) => {
      //   console.log(JSON.stringify(res));
      // });
  }

}
