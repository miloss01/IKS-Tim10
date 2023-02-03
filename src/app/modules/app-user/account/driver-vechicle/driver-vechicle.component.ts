/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { LoginAuthentificationService } from 'src/app/modules/auth/service/login-authentification.service'
import { ManageDriversService } from '../../manage-drivers/service/manage-drivers.service'
import { Vehicle } from 'src/app/models/models'
import { UserServiceService } from '../services/user.service'
import { MatCheckboxChange } from '@angular/material/checkbox'

@Component({
  selector: 'app-driver-vechicle',
  templateUrl: './driver-vechicle.component.html',
  styleUrls: ['./driver-vechicle.component.css']
})
export class DriverVechicleComponent implements OnInit {
  @Output() vehicleEvent = new EventEmitter<Vehicle>()
  vehicle: Vehicle = {
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
    carName: new FormControl('', Validators.required),
    lisencePlate: new FormControl('', Validators.required),
    numberOfSeats: new FormControl(0, Validators.required)
  })

  constructor (
    private readonly route: ActivatedRoute,
    private readonly userService: UserServiceService,
    private readonly manageDrivers: ManageDriversService,
    private readonly userAuthentificationService: LoginAuthentificationService) {
  }

  // Is component shown for driver viewing their own account
  isDriver = true

  ngOnInit (): void {
    if (this.userAuthentificationService.getRole() === 'ADMIN') {
      this.changingInformationForm.disable()
      this.userService.selectedValue$.subscribe((value) => {
        this.route.params.subscribe((params) => {
          this.userService
            .getVehicleById(value)
            .subscribe((fetchedVechicle: Vehicle) => {
              this.vehicle = fetchedVechicle
              console.log('DRIVER VEHICLE COMPONENT - Fetched Vehicle for User with id ' + value + ', ' + JSON.stringify(fetchedVechicle))
            })
        })
      })
      this.isDriver = false
    } else {
      this.route.params.subscribe((params) => {
        this.userService
          .getVehicleById(this.userAuthentificationService.getId())
          .subscribe((fetchedVechicle: Vehicle) => {
            this.vehicle = fetchedVechicle
            this.changingInformationForm.patchValue({
              carName: this.vehicle.model,
              lisencePlate: this.vehicle.licenseNumber,
              numberOfSeats: this.vehicle.passengerSeats
            })
            console.log('DRIVER VEHICLE COMPONENT - Fetched Vehicle for User with id ' + this.userAuthentificationService.getId() + ', ' + JSON.stringify(fetchedVechicle))
          })
      })
    }
  }

  toggle (event: MatCheckboxChange): void {
    console.log(event.source.checked)
    this.vehicle.babyTransport = event.source.checked
  }

  toggle2 (event: MatCheckboxChange): void {
    this.vehicle.petTransport = event.source.checked
  }

  saveChanges (): void {
    console.log(this.changingInformationForm.value)
    if (!this.changingInformationForm.valid) {
      return
    }
    if (this.changingInformationForm.get('carName')?.value) {
      this.vehicle.model = this.changingInformationForm.value.carName ?? ''
    }
    if (this.changingInformationForm.get('lisencePlate')?.value) {
      this.vehicle.licenseNumber = this.changingInformationForm.value.lisencePlate ?? ''
    }
    if (this.changingInformationForm.get('numberOfSeats')?.value) {
      this.vehicle.passengerSeats = this.changingInformationForm.value.numberOfSeats ?? 0
    }
    this.vehicleEvent.emit(this.vehicle)
  }
}
