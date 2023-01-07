import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RideNotificationDTO } from 'src/app/models/models';
import { RideServiceService } from 'src/app/modules/ride/service/ride-service.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private rideService: RideServiceService,
    private readonly router: Router
    ) { }

  snackRideAccepted(): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: 'Accepted successfully'
    })
  }

  snackRideDeclined(): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'info',
      title: 'Declined ride'
    })
  }

  alertRideRequest(notification: RideNotificationDTO): void {
    Swal.fire({
      title: "You have a new ride request!",
      showDenyButton: true,
      confirmButtonText: 'Accept',
      denyButtonText: `Decline`,
      confirmButtonColor: '#24ED80',
      html: '<p>'+ notification.message + '</p>',
      footer: '<a href="current-ride">Go to current ride section and decide there</a>',
      denyButtonColor: '#ff4625',
      width: 600,
      returnFocus: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.rideService.acceptRideById(notification.rideId).subscribe(
           (response: any) => {
             console.log('accepted ride' + response);
             this.snackRideAccepted();
             this.router.navigate(['current-ride'])
        });;
      } else if (result.isDenied) {
        this.rideService.cancelRide({"reason": "not rn"}, notification.rideId).subscribe(
          (response: any) => {
            console.log("declined ride");
            this.snackRideDeclined();
          }
        )
      }
    })
  }

}
