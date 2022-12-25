import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginAuthentificationService } from 'src/app/modules/auth/service/login-authentification.service';
import { UserServiceService } from '../services/user.service';

@Component({
  selector: 'app-driver-user-info',
  templateUrl: './driver-user-info.component.html',
  styleUrls: ['./driver-user-info.component.css']
})
export class DriverUserInfoComponent implements OnInit {
  // role:string = ""

  constructor(
    private route:ActivatedRoute,
    private userService: UserServiceService,
    private router: Router,
    private userAuthentificationService: LoginAuthentificationService) 
    { }

  ngOnInit(): void {
    // this.role = this.userAuthentificationService.getRole();
  }

  sendChangeRequest(): void {
    
  }

}
