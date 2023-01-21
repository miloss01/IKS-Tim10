/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { RideNotificationDTO } from 'src/app/models/models'
import { RideNotificationService } from '../../app-user/notification/service/ride-notification.service'
import { LoginAuthentificationService } from '../../auth/service/login-authentification.service'
import { WebsocketService } from '../../ride/service/websocket.service'

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  user: any

  constructor (private authService: LoginAuthentificationService,
    private socketService: WebsocketService,
    private notificationService: RideNotificationService,
    private readonly router: Router,
    private route: ActivatedRoute) {}

  badgeHidden: boolean = true

  hideMatBadge (): void {
    this.badgeHidden = true
  }

  ngOnInit (): void {
    this.authService.userState$.subscribe((res: any) => {
      this.user = res
      console.log(this.user)
    })
  }

  ngAfterViewInit (): void {
    const stompClient: any = this.socketService.initWebSocket()

    stompClient.connect({}, () => {
      console.log('trenutno je ulogovan (iz connect): ' + this.authService.getId());

      stompClient.subscribe('/ride-notification-driver-request/' + this.authService.getId(), (message: { body: string }) => {
        this.badgeHidden = false
        const notification: RideNotificationDTO = JSON.parse(message.body)
        console.log(JSON.stringify(notification))
        this.notificationService.setUpdated(notification)
        this.notificationService.alertRideRequest(notification)
      })

      stompClient.subscribe('/ride-notification-driver-withdrawal/' + this.authService.getId(), (message: { body: string }) => {
        const notification: RideNotificationDTO = JSON.parse(message.body)
        console.log(JSON.stringify(notification))
        this.notificationService.setUpdated(notification)
        this.notificationService.alertWithdrawal(notification)
      })

      stompClient.subscribe('/ride-notification-passenger/' + this.authService.getId(), (message: { body: string }) => {
        this.badgeHidden = false
        const notification: RideNotificationDTO = JSON.parse(message.body)
        console.log(JSON.stringify(notification))
        this.notificationService.setUpdated(notification)
        this.notificationService.alertPassengerNotification(notification.message)
      })

      if (this.authService.getRole() == "ADMIN") {
        console.log("Ulog admin")
        stompClient.subscribe('/ride-notification-panic', (message: { body: string }) => {
          this.badgeHidden = true
          const notification: RideNotificationDTO = JSON.parse(message.body)
          console.log(JSON.stringify(notification))
          this.notificationService.setUpdated(notification)
          this.notificationService.alertPanic(notification.message)
        })
      }
    })
  }

  logout (): void {
    if (this.authService.getRole() == "DRIVER") {
      this.authService.getActiveFlag().subscribe((res: any) => {
        console.log(res)
        const isActive: boolean = res.active
        if (isActive) {
          this.authService.endWorkingHour().subscribe((res: any) => {
            console.log(res)
            this.authService.changeActiveFlag(false).subscribe((res: any) => {
              console.log(res)
              this.authService.logout()
              void this.router.navigate(['']).then(async () => location.reload())
            })
          })
        } else {
          this.authService.logout()
          void this.router.navigate(['']).then(async () => location.reload())
        }
      })
    } else {
      // this.authService.logout()
      this.authService.changeActiveFlag(false).subscribe((res: any) => {
        console.log(res)
        this.authService.logout()
        void this.router.navigate([''])
      })
    }
    // console.log('eeeeeeeeeeeeeeeeeeeeeeeeee')
    // console.log(this.router.url)
    // void this.router.navigate([''])
  }
}
