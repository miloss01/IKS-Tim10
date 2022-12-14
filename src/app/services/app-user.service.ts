import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppUser } from '../appUser/app-user/app-user.component';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(environment.apiHost + 'api/passenger/1');
  }

  addPassenger(appUser: any): Observable<any> {
    const options: any = {
      responseType: 'text',
    };
    return this.http.post<string>(environment.apiHost + 'api/passenger', appUser, options);
  }

  addDriver(appUser: any): Observable<any> {
    const options: any = {
      responseType: 'text',
    };
    return this.http.post<string>(environment.apiHost + 'api/driver', appUser, options);
  }

}
