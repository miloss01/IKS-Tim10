import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DepartureDestination, ReasonDTO, Ride, RideCreation } from 'src/app/models/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RideServiceService {
  private value$ = new BehaviorSubject<any>({});
  selectedValue$ = this.value$.asObservable();

  private bookAgainValue$ = new BehaviorSubject<any>({});
  selectedBookAgainValue$ = this.bookAgainValue$.asObservable();


  constructor(private http: HttpClient) { }

  setValue(test: any) {
    this.value$.next(test);
  }

  setbookAgainValue(locations: DepartureDestination[]) {
    this.bookAgainValue$.next(locations);
  }

  getRideById(id: number): Observable<Ride> {
    return this.http.get<Ride>(environment.apiHost + "ride/" + id);
  }
  
  endRideById(id: number): Observable<any> {
    const options: any = {
      responseType: 'text',
    };
    return this.http.put<string>(environment.apiHost + "ride/" + id + '/end', {}, options);
  }

  addRide(ride: RideCreation): Observable<any> {
    const options: any = {
      responseType: 'text',
    };
    return this.http.post<string>(environment.apiHost + "ride", {
      locations: ride.locations,
      startTime: ride.startTime,
      passengers: ride.passengers,
      vehicleType: ride.vehicleType,
      babyTransport: ride.babyTransport,
      petTransport: ride.petTransport,
      estimatedTimeMinutes: ride.estimatedTimeMinutes}, options);
  }

  acceptRideById(id: number): Observable<any> {
    const options: any = {
      responseType: 'text',
    };
    return this.http.put<string>(environment.apiHost + "ride/" + id + '/accept', {}, options);
  }

  withdrawRideById(id: number): Observable<Ride> {
    return this.http.get<Ride>(environment.apiHost + "ride/" + id + '/withdraw');
  }

  cancelRide(reasonDto: ReasonDTO, id: number): Observable<any> {
    const options: any = {
      responseType: 'text',
    };

    return this.http.put<string>(
      environment.apiHost + 'ride/' + id + '/cancel',
      {
        reason: reasonDto.reason
      },
      options
    );
  }

  getActiveDriverRide(id: number) : Observable<HttpResponse<Ride>> {
    return this.http.get<Ride>(environment.apiHost + "ride/driver/" + id + "/active", {observe: "response"});
  }

  getActivePassengerRide(id: number) : Observable<HttpResponse<Ride>> {
    return this.http.get<Ride>(environment.apiHost + "ride/passenger/" + id + "/active", {observe: "response"});
  }

  getVehicleOfDriver(id: number) : Observable<any> {
    return this.http.get(environment.apiHost + "driver/" + id + "/vehicle");
  }

  endRide(id: number) : Observable<any> {
    const options: any = {
      responseType: 'text',
    };
    return this.http.put<string>(
      environment.apiHost + "ride/" + id + "/end",
      {
        id: id
      },
      options
      );
  }

  raisePanic(id: number) : Observable<any> {
    const options: any = {
      responseType: 'text',
    };
    return this.http.put<string>(
      environment.apiHost + "ride/" + id + "/panic",
      {
        id: id
      },
      options
      );
  }

  getAllPassengerRides(id: number) : Observable<any> {
    return this.http.get<Ride>(environment.apiHost + "passenger/" + id + "/ride");
  }

  getAllUserRides(id: number) : Observable<any> {
    return this.http.get<Ride>(environment.apiHost + "user/" + id + "/ride");
  }

}






