import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap, Observable } from 'rxjs';
import { Location, DepartureDestination, EstimateDataDTO } from 'src/app/models/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  departure$ = new BehaviorSubject({});
  destination$ = new BehaviorSubject({});

  departureState = this.departure$.asObservable();
  destinationState = this.destination$.asObservable();

  constructor(private http: HttpClient) {
    this.departure$.next({
      address: "",
      latitude: 0,
      longitude: 0
    });

    this.destination$.next({
      address: "",
      latitude: 0,
      longitude: 0
    });
  }

  public getLatLong(address: string): Observable<any> {
    return this.http.get("https://nominatim.openstreetmap.org/search?format=json&q=" + address);
  }

  public getAddressFromLatLong(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`, 
      {
        headers: new HttpHeaders({
          'accept-language': 'sr-Latn'
        })
      }
    );
  }

  postRequest(departureAddress: string, 
    destinationAddress: string, 
    vehicleType: string | undefined,
    petsTransport: boolean | undefined,
    babyTransport: boolean | undefined): Observable<any> {

    let req: EstimateDataDTO = {
      locations: [
        {
          departure: {
            address: departureAddress,
            latitude: 0,
            longitude: 0
          },
          destination: {
            address: destinationAddress,
            latitude: 0,
            longitude: 0
          }
        }
      ],
      vehicleType: vehicleType,
      petTransport: petsTransport,
      babyTransport: babyTransport
    }

    return this.getLatLong(departureAddress)
    .pipe(
      map((res: any) => {
        console.log(res);

        let ret: Location = {
          address: departureAddress,
          latitude: res[0].lat,
          longitude: res[0].lon
        }

        this.departure$.next(ret);
        req.locations[0].departure = ret;
      }),

      mergeMap(() => this.getLatLong(destinationAddress)),
      map((res: any) => {
        console.log(res);

        let ret: Location = {
          address: destinationAddress,
          latitude: res[0].lat,
          longitude: res[0].lon
        }

        this.destination$.next(ret);
        req.locations[0].destination = ret;
      }),

      mergeMap(() => this.http.post<string>(environment.apiHost + "unregisteredUser", req))
    )
  }

  postRequestRideDetails(departureAddress: string, 
    destinationAddress: string, 
    vehicleType: string | undefined,
    petsTransport: boolean | undefined,
    babyTransport: boolean | undefined): Observable<any> {

    let req: EstimateDataDTO = {
      locations: [
        {
          departure: {
            address: departureAddress,
            latitude: 0,
            longitude: 0
          },
          destination: {
            address: destinationAddress,
            latitude: 0,
            longitude: 0
          }
        }
      ],
      vehicleType: vehicleType,
      petTransport: petsTransport,
      babyTransport: babyTransport
    }

    return this.getLatLong(departureAddress)
    .pipe(
      map((res: any) => {
        console.log(res);

        let ret: Location = {
          address: departureAddress,
          latitude: res[0].lat,
          longitude: res[0].lon
        }

        this.departure$.next(ret);
        req.locations[0].departure = ret;
      }),

      mergeMap(() => this.getLatLong(destinationAddress)),
      map((res: any) => {
        console.log(res);

        let ret: Location = {
          address: destinationAddress,
          latitude: res[0].lat,
          longitude: res[0].lon
        }

        this.destination$.next(ret);
        req.locations[0].destination = ret;
      }),

      mergeMap(() => this.http.post<string>(environment.apiHost + "passenger-rides", req))
    )
  }

}
