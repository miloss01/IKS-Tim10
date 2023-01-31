import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { DriverDTO, VehicleDTO, VehicleType } from 'src/app/models/models'
import { AppUserService } from 'src/app/services/app-user.service'

@Component({
  selector: 'app-register-driver',
  templateUrl: './register-driver.component.html',
  styleUrls: ['./register-driver.component.css']
})
export class RegisterDriverComponent implements OnInit {
  vehicleTypes: VehicleType[] = [
    { value: 'STANDARD', viewValue: 'Standard' },
    { value: 'LUXURY', viewValue: 'Luxury' },
    { value: 'VAN', viewValue: 'Van' }
  ]

  registerDriverForm = new FormGroup({
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.required),

    model: new FormControl('', Validators.required),
    registrationPlate: new FormControl('', Validators.required),
    type: new FormControl(this.vehicleTypes[0].value),
    seats: new FormControl(0, Validators.required),
    pets: new FormControl(false),
    kids: new FormControl(false)
  })

  errorMessage: string = ''
  driverId: number = 0
  driverName: string = ''

  constructor (private readonly appUserService: AppUserService, private readonly snackBar: MatSnackBar) { }

  ngOnInit (): void {
  }

  registerDriver (): void {
    console.log('Value of form: ' + JSON.stringify(this.registerDriverForm.value))
    if (!this.registerDriverForm.valid) {
      this.errorMessage = 'Form not valid'
      return
    }

    const driver: DriverDTO = {
      id: null,
      name: this.registerDriverForm.value.name ?? '',
      surname: this.registerDriverForm.value.lastName ?? '',
      telephoneNumber: this.registerDriverForm.value.phone ?? '',
      email: this.registerDriverForm.value.email ?? '',
      address: this.registerDriverForm.value.address ?? '',
      profilePicture: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg?resize=768,512',
      password: this.registerDriverForm.value.password ?? ''
    }

    console.log(driver)

    this.appUserService.addDriver(driver).subscribe(
      (res: any) => {
        console.log(res)
        this.driverId = res.id
        this.driverName = res.name
        this.errorMessage = ''
      },
      (err: any) => {
        console.log(err)
        if (err.error.message != undefined) {
          this.errorMessage = err.error.message
          return
        }
        this.errorMessage = err.error
      }
    )

      // this.appUserService
      // .addPassenger(this.registerDriverForm.value)
      // .subscribe((res: any) => {
      //   console.log(JSON.stringify(res));
      // });
  }

  addVehicle (): void {
    if (this.driverId === 0) {
      this.errorMessage = 'You must add driver before creating vehicle'
      return
    }
    if (!this.registerDriverForm.valid) {
      this.errorMessage = 'Form not valid'
      return
    }
    const vehicle: VehicleDTO = {
      id: null,
      driverId: null,
      vehicleType: this.registerDriverForm.value.type!,
      model: this.registerDriverForm.value.model ?? '',
      licenseNumber: this.registerDriverForm.value.registrationPlate ?? '',
      currentLocation: {
        address: 'Strazilovska 20, novi sad',
        latitude: 45.2501342,
        longitude: 19.8480507
      },
      passengerSeats: this.registerDriverForm.value.seats!,
      babyTransport: this.registerDriverForm.value.kids!,
      petTransport: this.registerDriverForm.value.pets!
    }

    this.appUserService.setDriverVehicle(Number(this.driverId), vehicle).subscribe(
      (res: any) => {
        console.log(res)
        this.errorMessage = ''
        this.snackBar.open(`Successfully added driver: ${this.driverName} with vehicle (${res.id}) ${res.model}`, "Close");
      },
      (err: any) => {
        console.log(err)
        if (err.error.message != undefined) {
          this.errorMessage = err.error.message
          return
        }
        this.errorMessage = err.error
      }
    )
  }
}
