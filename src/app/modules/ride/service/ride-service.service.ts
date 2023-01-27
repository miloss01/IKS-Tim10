import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { DepartureDestination, FavoriteRouteDTO, ReasonDTO, Ride, RideCreation, RideResponseDTO, VehicleResponceDTO } from 'src/app/models/models'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RideServiceService {
  private readonly value$ = new BehaviorSubject<any>({})
  selectedValue$ = this.value$.asObservable()

  private readonly bookAgainValue$ = new BehaviorSubject<FavoriteRouteDTO>({
      id: null,  
      favoriteName: "",
      locations: [],
      passengers: [],
      vehicleType: 'standard',
      babyTransport: false,
      petTransport: false  
  })
  selectedBookAgainValue$ = this.bookAgainValue$.asObservable()

  constructor (private readonly http: HttpClient) { }

  setValue (test: any): void {
    this.value$.next(test)
  }

  setbookAgainValue (val : FavoriteRouteDTO): void {
    this.bookAgainValue$.next(val);
  }

  getRideById (id: number): Observable<Ride> {
    return this.http.get<Ride>(environment.apiHost + 'ride/' + id.toString())
  }

  endRideById (id: number): Observable<any> {
    const options: any = {
      responseType: 'text'
    }
    return this.http.put<string>(environment.apiHost + 'ride/' + id + '/end', {}, options);
  }

  addRide (ride: RideCreation): Observable<any> {
    const options: any = {
      responseType: 'text'
    }
    return this.http.post<string>(environment.apiHost + 'ride', {
      locations: ride.locations,
      startTime: ride.startTime,
      passengers: ride.passengers,
      vehicleType: ride.vehicleType,
      babyTransport: ride.babyTransport,
      petTransport: ride.petTransport,
      estimatedTimeMinutes: ride.estimatedTimeMinutes,
      distance: ride.distance,
      price: ride.price
    }, options)
  }

  acceptRideById(id: number): Observable<any> {
    const options: any = {
      responseType: 'json'
    };
    return this.http.put<string>(environment.apiHost + "ride/" + id + '/accept', {}, options);
  }

  startRide(id: number): Observable<any> {
    const options: any = {
      responseType: 'json'
    };
    return this.http.put<string>(environment.apiHost + "ride/" + id + '/start', {}, options);
  }

  withdrawRideById(id: number): Observable<any> {
    const options: any = {
      responseType: 'json'
    };
    return this.http.put<string>(environment.apiHost + "ride/" + id + '/withdraw', {}, options);
  }

  cancelRide(reasonDto: ReasonDTO, id: number): Observable<any> {
    const options: any = {
      responseType: 'text'
    }

    return this.http.put<string>(
      environment.apiHost + 'ride/' + id + '/cancel',
      {
        reason: reasonDto.reason
      },
      options
    )
  }


  getActiveDriverRide(id: number) : Observable<any> {
    return this.http.get<Ride>(environment.apiHost + "ride/driver/" + id + "/active", {observe: "response"});
  }

  getAcceptedDriverRide(id: number) : Observable<any> {
    return this.http.get<Ride>(environment.apiHost + "ride/driver/" + id + "/accepted", {observe: "response"});
  }

  getPendingDriverRide(id: number) : Observable<any> {
    return this.http.get<Ride>(environment.apiHost + "ride/driver/" + id + "/pending", {observe: "response"});
  }

  getActivePassengerRide(id: number) : Observable<HttpResponse<Ride>> {
    return this.http.get<Ride>(environment.apiHost + "ride/passenger/" + id + "/active", {observe: "response"});
  }

  getAcceptedPassengerRide(id: number) : Observable<any> {
    return this.http.get<Ride>(environment.apiHost + "ride/passenger/" + id + "/accepted", {observe: "response"});
  }

  getPendingPassengerRide(id: number) : Observable<any> {
    return this.http.get<Ride>(environment.apiHost + "ride/passenger/" + id + "/pending", {observe: "response"});
  }

  getVehicleOfDriver(id: number) : Observable<any> {
    return this.http.get(environment.apiHost + "driver/" + id + "/vehicle");
  }

  endRide (id: number): Observable<any> {
    const options: any = {
      responseType: 'text'
    }
    return this.http.put<string>(
      environment.apiHost + "ride/" + id + "/end",
      {
        id: id
      },
      options
    )
  }

  raisePanic(id: number, reason: ReasonDTO): Observable<any> {
    return this.http.put<ReasonDTO>(environment.apiHost + "ride/" + id + "/panic", reason)
  }

  getAllPassengerRides (id: number): Observable<any> {
    return this.http.get<Ride>(environment.apiHost + "passenger/" + id + "/ride")
  }

  getAllUserRides (id: number): Observable<any> {
    return this.http.get<Ride>(environment.apiHost + "user/" + id + "/ride")
  }

  getFavoriteRoutes(): Observable<any> {
    return this.http.get<FavoriteRouteDTO[]>(environment.apiHost + "ride/favorites")
  }

  saveFavoriteRoute(favorite: FavoriteRouteDTO) : Observable<any> {
    const options: any = {
      responseType: 'json',
    };
    return this.http.post<FavoriteRouteDTO>(environment.apiHost + "ride/favorites", {
      favoriteName: favorite.favoriteName,
      locations: favorite.locations,
      passengers: favorite.passengers,
      vehicleType: favorite.vehicleType,
      babyTransport: favorite.babyTransport,
      petTransport: favorite.petTransport  
    }, options);

  }

  deleteFavoriteRoute(favorite: FavoriteRouteDTO) : Observable<any> {
    return this.http.delete<string>(environment.apiHost + "ride/favorites/" + favorite.id);
  }

  getAllUserRidesWithDates (id: number, start: string, end: string): Observable<RideResponseDTO> {
    return this.http.get<RideResponseDTO>(environment.apiHost + "user/" + id + "/ride?sort=startTime,asc&from=" + start + "&to=" + end)
  }

  getVehiclesForMap (): Observable<any> {
    return this.http.get<VehicleResponceDTO>(environment.apiHost + 'vehicle/all')
  }

  getAllRides(start: string, end: string): Observable<RideResponseDTO> {
    return this.http.get<RideResponseDTO>(environment.apiHost + "ride/getAllRides?sort=startTime,asc&from=" + start + "&to=" + end)
  }
}
