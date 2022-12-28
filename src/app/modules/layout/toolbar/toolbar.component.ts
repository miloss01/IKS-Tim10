import { Component, OnInit } from '@angular/core';
import { LoginAuthentificationService } from '../../auth/service/login-authentification.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  user: any;

  constructor(private authService: LoginAuthentificationService) {}

  ngOnInit(): void {
    this.authService.userState$.subscribe((res: any) => {
      this.user = res;
      console.log(this.user);
    })
  }

  logout(): void {
    this.authService.changeActiveFlag(false)
    .subscribe((res: any) => {
      console.log(res);
    });
    this.authService.logout();
  }

}
