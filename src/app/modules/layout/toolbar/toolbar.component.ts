/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Component, OnInit } from '@angular/core';
import { RideNotificationDTO } from 'src/app/models/models';
import { NotificationService } from '../../app-user/notification/service/notification.service';
import { LoginAuthentificationService } from '../../auth/service/login-authentification.service';
import { WebsocketService } from '../../ride/service/websocket.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  user: any;

  constructor(private authService: LoginAuthentificationService,
    private socketService: WebsocketService,
    private notificationService: NotificationService
    ) {}

  badgeHidden: boolean = true

  hideMatBadge(): void {
    this.badgeHidden = true;
  }

  ngOnInit(): void {
    this.authService.userState$.subscribe((res: any) => {
      this.user = res;
      console.log(this.user);
    })
  }

  ngAfterViewInit (): void {
    const stompClient: any = this.socketService.initWebSocket()

    stompClient.connect({}, () => {
      stompClient.subscribe('/ride-notification-driver/' + this.authService.getId(), (message: { body: string }) => {
        const notification: RideNotificationDTO = JSON.parse(message.body);
        this.badgeHidden = false;
        this.notificationService.alertRideRequest(notification);
      })
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
