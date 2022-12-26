import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageDriversService } from '../../manage-drivers/service/manage-drivers.service';
import { UserServiceService } from '../services/user.service';

@Component({
  selector: 'app-basic-user-information',
  templateUrl: './basic-user-information.component.html',
  styleUrls: ['./basic-user-information.component.css']
})
export class BasicUserInformationComponent implements OnInit {
  //imageSrc: string;
  user:AppUser = {
    id: 0,
    name: '',
    surname: 'Feling',
    telephoneNumber: '0653531317',
    email: 'sandra@gmail.com',
    address: 'Novi Sad',
    profilePicture: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg?resize=768,512'
  }

  constructor(
    private route:ActivatedRoute,
    private userService: UserServiceService,
    private manageDrivers: ManageDriversService,
    private router: Router
  ) {
    //this.imageSrc = "http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcS-OZTPpZNsnOchlOMmYsSeMprn5sYU4kdOZGPL0_ksM2nHGegFrzLhGlQMBF-amQqPRFs4DzbLrI_o5gA";
    //this.imageSrc = "https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg?resize=768,512";
    
   }

   isDriverOrPassenger = true;


  changingInformationForm = new FormGroup({
    name: new FormControl,
    lastName: new FormControl(),
    telephone: new FormControl(),
    email: new FormControl(),
    adress: new FormControl(),
  })

  ngOnInit(): void {
    this.userService.selectedValue$.subscribe((value) => {
      this.user.id = value;
      this.route.params.subscribe((params) => {
        console.log("BASIC USER INFO COMPONENT - USER ID" + this.user.id)
        this.userService
        .getUserById(this.user.id)
        .subscribe((fetchedUser:AppUser) => {
          this.user =fetchedUser; 
          })
      });
    })
    this.isDriverOrPassenger = this.manageDrivers.isChangingEnabled();
    if (!this.isDriverOrPassenger) this.changingInformationForm.disable();
  }

  submitChanges(): void{
    if (this.changingInformationForm.get('name')?.value){
      this.user.name = this.changingInformationForm.get('name')?.value;
    }
    if (this.changingInformationForm.get('lastName')?.value){
      this.user.surname = this.changingInformationForm.get('lastName')?.value;    }
    if (this.changingInformationForm.get('telephone')?.value){
      this.user.telephoneNumber = this.changingInformationForm.get('telephone')?.value;
    }
    if (this.changingInformationForm.get('email')?.value){
      this.user.email = this.changingInformationForm.get('email')?.value;
    }
    if (this.changingInformationForm.get('adress')?.value){
      this.user.address = this.changingInformationForm.get('adress')?.value;
    }
    this.userService
    .saveChanges(this.user)
    .subscribe((res: any) => {
        console.log(res);
        this.router.navigate(['passenger-account']);
    });
  }

  changePicture(): void {}


}

export interface AppUser {
  id: number;
  name: string,
  surname: string,
  telephoneNumber: string,
  email: string,
  address: string,
  profilePicture: string
}
