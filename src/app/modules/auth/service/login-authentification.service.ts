import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthentificationService {

  user$ = new BehaviorSubject({});
  userState$ = this.user$.asObservable();

  constructor(private http: HttpClient) {
    this.user$.next({
      "email": this.getEmail(),
      "role": this.getRole(),
      "id": this.getId()
    });
  }

  getUserDetails(){
    //post details to api and check
  }

  login(auth: any): Observable<any> {

    return this.http.post<string>(environment.apiHost + "user/login", auth);

  }

  changeActiveFlag(activee:boolean): Observable<any>{
    return this.http.put<string>(environment.apiHost + "user/changeActiveFlag/" + this.getId(), {active: activee});

  }

  addWorkingHour(): Observable<any>{
    let currentDate = new Date();
    return this.http.post<string>(environment.apiHost + "driver/"+ this.getId() + "/working-hour", {start: currentDate.toISOString().replace('T', ' ').substring(0, 19)});

  }

  endWorkingHour(): Observable<any>{
    let currentDate = new Date();
    return this.http.post<string>(environment.apiHost + "driver/"+ this.getId() + "/working-hour", {end: currentDate.toISOString().replace('T', ' ').substring(0, 19)});

  }

  getRole(): any {
    if (this.isLoggedIn()) {
      console.log("logovan")
      const accessToken: any = localStorage.getItem('user');
      const helper = new JwtHelperService();
      const role = helper.decodeToken(accessToken).role;
      return role;
    }
    return null;
  }

  getEmail(): any {
    if (this.isLoggedIn()) {
      console.log("logovan")
      const accessToken: any = localStorage.getItem('user');
      const helper = new JwtHelperService();
      const email = helper.decodeToken(accessToken).sub;
      return email;
    }
    return null;
  }

  getId(): any {
    if (this.isLoggedIn()) {
      console.log("logovan")
      const accessToken: any = localStorage.getItem('user');
      const helper = new JwtHelperService();
      const id = helper.decodeToken(accessToken).id;
      return id;
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('user') != null) {
      return true;
    }
    return false;
  }

  setUser(): void {
    this.user$.next({
      "email": this.getEmail(),
      "role": this.getRole(),
      "id": this.getId()
    });
  }

  logout(): void {
    localStorage.removeItem("user");
    this.user$.next({});
    
  }

}
