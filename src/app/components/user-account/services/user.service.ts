import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppUser } from '../basic-user-information/basic-user-information.component';
import { Vehicle } from '../driver-vechicle/driver-vechicle.component';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private value$ = new BehaviorSubject<any>({});
  selectedValue$ = this.value$.asObservable();

  constructor(private http: HttpClient) { }

  setValue(test: any) {
    this.value$.next(test);
  }

  getUser(): Observable<AppUser> {
    return this.http.get<AppUser>(environment.apiHost + "passenger/1");
  }
  getVechicle():Observable<Vehicle> {
    return this.http.get<Vehicle>(environment.apiHost + "driver/1/vehicle");
  }

  saveChanges(user: AppUser): Observable<any> {
    const options: any = {
      responseType: 'text',
    };

    return this.http.put<string>(
      environment.apiHost + 'passenger/1',
      user,
      options
    );
  }

}
