import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { RideNotificationDTO } from 'src/app/models/models';
import { RideServiceService } from 'src/app/modules/ride/service/ride-service.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RideNotificationService {

  private updated$ = new BehaviorSubject<any>({});
  updatedValue$ = this.updated$.asObservable();

  constructor(private rideService: RideServiceService,
    private readonly router: Router
    ) { }

  setUpdated(test: any) {
    this.updated$.next(test);
  }

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
      title: 'Ride succesfully accepted.'
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
      showDenyButton: false,
      showConfirmButton: false,
      html: '<p>'+ notification.message + '</p>',
      footer: '<a href="current-ride">Go to current ride section and decide on acceptance.</a>',
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

  alertAlreadyPending (): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'You can\'t book another ride with one already pending.',
      confirmButtonColor: '#6A7A9E',
    })
  }

  alertWithdrawal (notification: RideNotificationDTO): void {
    Swal.fire({
      icon: 'error',
      title: 'Ride has been cancelled.',
      text: notification.message,
      confirmButtonColor: '#6A7A9E',
    })
  }

  alertPassengerNotification (content: string): void {
    Swal.fire({
      icon: 'info',
      text: content,
      confirmButtonText: 'OK!',
      confirmButtonColor: '#6A7A9E',
      footer: '<a href="current-ride">View ride details.</a>',
    })
  }

  alertNotAvailable (): void {
    Swal.fire({
      icon: 'warning',
      title: 'Booking failed :(',
      text: "No available drivers for your request. Try booking again in a little bit.",
      confirmButtonText: 'OK',
      confirmButtonColor: '#6A7A9E',
    })
  }


}
