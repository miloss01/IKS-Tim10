import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-user',
  templateUrl: './app-user.component.html',
  styleUrls: ['./app-user.component.css']
})
export class AppUserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

export interface AppUser {
  _id: number;
  name: string;
  surname: string;
  profilePicture: string;
  telephoneNumber: string;
  email: string;
  address: string;
}
