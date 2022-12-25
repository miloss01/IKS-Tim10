import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChangeRequest, ChangeRequestResponce } from 'src/app/models/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangeRequestService {
  private value$ = new BehaviorSubject<any>({});
  selectedValue$ = this.value$.asObservable();

  constructor(private http: HttpClient) { }

  setValue(test: any) {
    this.value$.next(test);
  }

  getPendingChangeRequests(): Observable<ChangeRequestResponce> {
    return this.http.get<ChangeRequestResponce>(environment.apiHost + "driver/change-requests");
  }

  acceptChangesRequest(changeRequest: ChangeRequest, driverId:number): Observable<any> {
    const options: any = {
      responseType: 'text',
    };

    return this.http.put<string>(
      environment.apiHost + 'driver/change-request/approve/' + driverId,
      {
        userDTO:{
          name: changeRequest.userDTO.name,
          surname: changeRequest.userDTO.surname,
          telephoneNumber: changeRequest.userDTO.telephoneNumber,
          email: changeRequest.userDTO.email,
          address: changeRequest.userDTO.address,
          profilePicture: changeRequest.userDTO.profilePicture
        },
        vehicleDTO: {
          id: changeRequest.vehicleDTO.id,
          driverId: changeRequest.vehicleDTO.driverId,
          vehicleType: changeRequest.vehicleDTO.vehicleType,
          model: changeRequest.vehicleDTO.model,
          licenseNumber: changeRequest.vehicleDTO.licenseNumber,
          currentLocation: {
            address: "",
            latitude: "",
            longitude: ""
          },
          passengerSeats: changeRequest.vehicleDTO.passengerSeats,
          babyTransport: changeRequest.vehicleDTO.babyTransport,
          petTransport: changeRequest.vehicleDTO.petTransport
        },
        date: changeRequest.date

      },
      options
      );
    }
}
