import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-basic-user-information',
  templateUrl: './basic-user-information.component.html',
  styleUrls: ['./basic-user-information.component.css']
})
export class BasicUserInformationComponent implements OnInit {
  imageSrc: string;

  constructor() {
    this.imageSrc = "https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg?resize=768,512";
    this.changingInformationForm.setValue({
      name: "Sandra",
      lastName: "Feling",
      telephone: "0653531317",
      email: "sandra@gmail.com",
      adress: "Novi Sad"
    });
   }

  changingInformationForm = new FormGroup({
    name: new FormControl,
    lastName: new FormControl(),
    telephone: new FormControl(),
    email: new FormControl(),
    adress: new FormControl(),
  })

  ngOnInit(): void {
    
  }

  submitChanges(): void{}
  changePicture(): void {}

}
