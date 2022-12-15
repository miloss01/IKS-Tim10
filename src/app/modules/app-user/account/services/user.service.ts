import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppUser } from '../basic-user-information/basic-user-information.component';
import { DocumentDTO } from '../driver-documents/driver-documents.component';
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
    return this.http.get<AppUser>(environment.apiHost + "api/passenger/2");
  }
  
  getVechicle():Observable<Vehicle> {
    return this.http.get<Vehicle>(environment.apiHost + "api/driver/1/vehicle");
  }

  saveChanges(user: AppUser): Observable<any> {
    const options: any = {
      responseType: 'text',
    };

    return this.http.put<string>(
      environment.apiHost + 'api/passenger/2',
      {
        name: user.name,
        surname: user.surname,
        telephoneNumber: user.telephoneNumber,
        email: user.email,
        address: user.address,
        profilePicture: user.profilePicture
      },
      options
    );
  }

  getDriverDocuments(): Observable<DocumentDTO[]> {
    return this.http.get<DocumentDTO[]>(environment.apiHost + 'api/driver/1/documents');
  }

}
