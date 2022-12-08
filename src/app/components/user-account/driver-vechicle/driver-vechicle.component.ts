import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-driver-vechicle',
  templateUrl: './driver-vechicle.component.html',
  styleUrls: ['./driver-vechicle.component.css']
})
export class DriverVechicleComponent implements OnInit {
  imageSrc: string;

  constructor() {
    this.imageSrc = "https://www.magazinauto.com/wp-content/uploads/2020/09/IMG_3305-e1600082024266-680x365.jpg";
   }

  ngOnInit(): void {
  }

}
