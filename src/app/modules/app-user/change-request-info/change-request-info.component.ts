import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUser, ChangeRequest, Vehicle } from 'src/app/models/models';
import { BlockDialogComponent } from '../../layout/dialogs/block-dialog/block-dialog.component';
import { UserServiceService } from '../account/services/user.service';
import { ChangeRequestService } from '../services/change-request.service';

@Component({
  selector: 'app-change-request-info',
  templateUrl: './change-request-info.component.html',
  styleUrls: ['./change-request-info.component.css']
})
export class ChangeRequestInfoComponent implements OnInit {
  changeRequest: ChangeRequest = {
    userDTO:{
      id: 0,
      name: "",
      surname: "",
      telephoneNumber: "",
      email: "",
      address: "",
      profilePicture: ""
    },
    vehicleDTO: {
      id: 0,
      driverId: 0,
      vehicleType: "",
      model: "",
      licenseNumber: "",
      currentLocation: {
        address: "",
        latitude: 0,
        longitude: 0
      },
      passengerSeats: 0,
      babyTransport: true,
      petTransport: true
    },
    date: ""
  };

  userData: ChangeRequest = {
    userDTO:{
      id: 0,
      name: "",
      surname: "",
      telephoneNumber: "",
      email: "",
      address: "",
      profilePicture: ""
    },
    vehicleDTO: {
      id: 0,
      driverId: 0,
      vehicleType: "",
      model: "",
      licenseNumber: "",
      currentLocation: {
        address: "",
        latitude: 0,
        longitude: 0
      },
      passengerSeats: 0,
      babyTransport: true,
      petTransport: true
    },
    date: ""
  };


  constructor(
    public dialogRef: MatDialogRef<BlockDialogComponent>,
    private router: Router,
    private route:ActivatedRoute,
    private userService: UserServiceService,
    private changeRequestService: ChangeRequestService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.changeRequest = data.changeeRequest;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userService
      .getUser(this.changeRequest.vehicleDTO.driverId)
      .subscribe((fetchedUser:AppUser) => {
        this.userData.userDTO =fetchedUser;
        console.log("na"); 
        })
    });

    this.route.params.subscribe((params) => {
      this.userService
      .getVechicle(this.changeRequest.vehicleDTO.driverId)
      .subscribe((fetchedVechicle:Vehicle) => {
        this.userData.vehicleDTO =fetchedVechicle; 
        console.log(fetchedVechicle);})
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
    this.router.navigate(['/manage-change-requests']);
  }

  acceptRequest(): void {
    this.route.params.subscribe((params) => {
      this.changeRequestService
      .acceptChangesRequest(this.changeRequest, this.changeRequest.userDTO.id)
      .subscribe((res:any) => {
        console.log(res); 
        this.router.navigate(['/manage-change-requests']);
        })
    });
  }
}
