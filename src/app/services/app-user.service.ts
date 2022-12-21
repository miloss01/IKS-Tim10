import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
    const options: any = {
      responseType: 'text',
    };
    return this.http.post<string>(environment.apiHost + 'passenger', appUser, options);
  }
  
  addDriver(appUser: any): Observable<any> {
    const options: any = {
      responseType: 'text',
    };
    return this.http.post<string>(environment.apiHost + 'driver', appUser, options);
  }
  
  blockUser(id: number): Observable<any> {
    return new Observable<AppUser>();
  }
  
}
