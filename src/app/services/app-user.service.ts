import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppUserForRide, MessageReceivedDTO, MessageResponseDTO, MessageSentDTO, PasswordResetCodeDTO, VehicleDTO } from '../models/models';
import { AppUser } from '../modules/app-user/account/basic-user-information/basic-user-information.component';
import { accountsDTO } from '../modules/app-user/manage-passengers/manage-passengers.component';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {
  
  constructor(private http: HttpClient) { }
  
  getAll(): Observable<accountsDTO> {
    return this.http.get<accountsDTO>(environment.apiHost + 'passenger');
  }
  
  addPassenger(appUser: any): Observable<any> {
    return this.http.post<string>(environment.apiHost + 'passenger', appUser);
  }
  
  addDriver(appUser: any): Observable<any> {
    return this.http.post<string>(environment.apiHost + 'driver', appUser);
  }

  setDriverVehicle(driverId: number, vehicle: VehicleDTO) {
    return this.http.post<string>(environment.apiHost + 'driver/' + driverId + "/vehicle", vehicle);
  }
  
  blockUser(id: number): Observable<any> {
    return new Observable<AppUser>();
  }

  requestCode(data: PasswordResetCodeDTO): Observable<any> {
    return this.http.post(environment.apiHost + "user/resetPassword", data);
  }

  applyCode(data: PasswordResetCodeDTO): Observable<any> {
    return this.http.put(environment.apiHost + "user/resetPassword", data, { observe: "response" });
  }

  sendMessage(id: number, message: MessageSentDTO): Observable<MessageReceivedDTO> {
    return this.http.post<MessageReceivedDTO>(environment.apiHost + "user/" + id + "/message", message);
  }

  getMessagesByUserId(id: number): Observable<MessageResponseDTO> {
    return this.http.get<MessageResponseDTO>(environment.apiHost + "user/" + id + "/message?sort=timeSent,asc");
  }

  getAdmins(): Observable<AppUserForRide[]> {
    return this.http.get<AppUserForRide[]>(environment.apiHost + "user/admins");
  }
  
}
