/* eslint-disable @typescript-eslint/no-floating-promises */
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AppUser, ChangeRequest, Vehicle } from 'src/app/models/models'
import { LoginAuthentificationService } from 'src/app/modules/auth/service/login-authentification.service'
import Swal from 'sweetalert2'
import { ChangeRequestService } from '../../services/change-request.service'
import { UserServiceService } from '../services/user.service'

@Component({
  selector: 'app-driver-user-info',
  templateUrl: './driver-user-info.component.html',
  styleUrls: ['./driver-user-info.component.css']
})
export class DriverUserInfoComponent implements OnInit {
  // role:string = ""
  changeRequest: ChangeRequest = {
    userDTO: {
      id: 0,
      name: '',
      surname: '',
      telephoneNumber: '',
      email: '',
      address: '',
      profilePicture: ''
    },
    vehicleDTO: {
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
      babyTransport: true,
      petTransport: true
    },
    date: ''
  }

  constructor (
    private readonly route: ActivatedRoute,
    private readonly userService: UserServiceService,
    private readonly router: Router,
    private readonly userAuthentificationService: LoginAuthentificationService,
    private readonly changeRequestService: ChangeRequestService) { }

  ngOnInit (): void {
    this.route.params.subscribe((params) => {
      this.userService
        .getUser(this.userAuthentificationService.getId())
        .subscribe((fetchedUser: AppUser) => {
          this.changeRequest.userDTO = fetchedUser
          console.log('na')
        })
    })

    this.route.params.subscribe((params) => {
      this.userService
        .getVechicle(this.userAuthentificationService.getId())
        .subscribe((fetchedVechicle: Vehicle) => {
          this.changeRequest.vehicleDTO = fetchedVechicle
          console.log(fetchedVechicle)
        })
    })
  }

  addVehicleChange (vehicle: Vehicle): void {
    this.changeRequest.vehicleDTO = vehicle
    console.log(this.changeRequest)
  }

  adduserChange (user: AppUser): void {
    this.changeRequest.userDTO = user
  }

  sendChangeRequest (): void {
    this.route.params.subscribe((params) => {
      this.changeRequestService
        .updateChangesRequest(this.changeRequest, this.changeRequest.userDTO.id)
        .subscribe((fetchedVechicle: Vehicle) => {
          this.changeRequest.vehicleDTO = fetchedVechicle
          console.log(fetchedVechicle)
        })
    })
    Swal.fire('Change request sent', 'Your request has been set for review.', 'success')
  }
}
