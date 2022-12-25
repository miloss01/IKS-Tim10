import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginAuthentificationService } from 'src/app/modules/auth/service/login-authentification.service';
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

  role:string = ""

  constructor(
    private route:ActivatedRoute,
    private userService: UserServiceService,
    private router: Router,
    private userAuthentificationService: LoginAuthentificationService) {
    //this.imageSrc = "http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcS-OZTPpZNsnOchlOMmYsSeMprn5sYU4kdOZGPL0_ksM2nHGegFrzLhGlQMBF-amQqPRFs4DzbLrI_o5gA";
    //this.imageSrc = "https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg?resize=768,512";
    
   }

  changingInformationForm = new FormGroup({
    name: new FormControl,
    lastName: new FormControl(),
    telephone: new FormControl(),
    email: new FormControl(),
    adress: new FormControl(),
  })

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userService
      .getUser(this.userAuthentificationService.getId())
      .subscribe((fetchedUser:AppUser) => {
        this.user =fetchedUser; 
        })
    });
    this.role = this.userAuthentificationService.getRole();
  }

  submitChanges(): void{
    if (this.role == "PASSENGER") {
      this.passengerSubmit();
    }
    else {
      this.driverSubmit();
    }
  }

  driverSubmit() {
    throw new Error('Method not implemented.');
  }

  passengerSubmit() : void{
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
    .saveChanges(this.user, this.userAuthentificationService.getId())
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


