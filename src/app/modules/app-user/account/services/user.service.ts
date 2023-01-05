/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/prefer-readonly */
import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { DocumentDTO, Vehicle } from 'src/app/models/models'
import { environment } from 'src/environments/environment'
import { AppUser } from '../basic-user-information/basic-user-information.component'

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private value$ = new BehaviorSubject<any>({})
  selectedValue$ = this.value$.asObservable()

  constructor (private http: HttpClient) { }

  setValue (test: any): void {
    this.value$.next(test)
  }

  getUser (id: number): Observable<AppUser> {
    return this.http.get<AppUser>(environment.apiHost + "passenger/" + id)
  }

  getVechicle (id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(environment.apiHost + "driver/" + id + "/vehicle")
  }

  getVehicleById (id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(environment.apiHost + "driver/" + id + "/vehicle")
  }

  saveChanges (user: AppUser, id: number): Observable<any> {
    const options: any = {
      responseType: 'text'
    }

    return this.http.put<string>(
      environment.apiHost + 'passenger/' + id,
      {
        name: user.name,
        surname: user.surname,
        telephoneNumber: user.telephoneNumber,
        email: user.email,
        address: user.address,
        profilePicture: user.profilePicture
      },
      options
    )
  }

  getDriverDocuments (id: number): Observable<DocumentDTO[]> {
    return this.http.get<DocumentDTO[]>(environment.apiHost + 'driver/' + id + '/documents')
  }

  getUserById (id: number): Observable<AppUser> {
    let params = new HttpParams()
    params = params.append('id', id)
    return this.http.get<AppUser>(environment.apiHost + "user/1", { params })
  }

  getUserByEmail (email: string): Observable<AppUser> {
    let params = new HttpParams()
    params = params.append('email', email)
    return this.http.get<AppUser>(environment.apiHost + "user/email", { params })
  }

  getDriverById (id: number): Observable<AppUser> {
    return this.http.get<AppUser>(environment.apiHost + "driver/" + id)
  }
}
