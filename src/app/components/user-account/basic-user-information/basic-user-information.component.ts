import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router
  ) {
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
      .getUser()
      .subscribe((fetchedUser:AppUser) => {
        this.user =fetchedUser; 
        /*this.changingInformationForm.setValue({
          name: fetchedUser.name,
          lastName: fetchedUser.surname,
          telephone: fetchedUser.telephoneNumber,
          email: fetchedUser.email,
          adress: fetchedUser.address
        });*/})
    });
  }

  submitChanges(): void{
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
