import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReasonDTO, Ride } from 'src/app/models/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RideServiceService {
  private value$ = new BehaviorSubject<any>({});
  selectedValue$ = this.value$.asObservable();

  constructor(private http: HttpClient) { }

  setValue(test: any) {
    this.value$.next(test);
  }

  getRideById(id: number): Observable<Ride> {
    return this.http.get<Ride>(environment.apiHost + "api/ride/" + id);
  }
  
  endRideById(id: number): Observable<any> {
    const options: any = {
      responseType: 'text',
    };
    return this.http.put<string>(environment.apiHost + "api/ride/" + id + '/end', {}, options);
  }

  acceptRideById(id: number): Observable<any> {
    const options: any = {
      responseType: 'text',
    };
    return this.http.put<string>(environment.apiHost + "api/ride/" + id + '/accept', {}, options);
  }

  withdrawRideById(id: number): Observable<Ride> {
    return this.http.get<Ride>(environment.apiHost + "api/ride/" + id + '/withdraw');
  }

  cancelRide(reasonDto: ReasonDTO, id: number): Observable<any> {
    const options: any = {
      responseType: 'text',
    };

    return this.http.put<string>(
      environment.apiHost + 'api/ride/' + id + '/cancel',
      {
        reason: reasonDto.reason
      },
      options
    );
  }
}






