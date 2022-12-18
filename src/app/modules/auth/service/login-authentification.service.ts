import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthentificationService {

  user$ = new BehaviorSubject(null);
  userState$ = this.user$.asObservable();

  constructor(private http: HttpClient) {
    this.user$.next(this.getRole());
  }

  getUserDetails(){
    //post details to api and check
  }

  login(auth: any): Observable<any> {
    return this.http.post<any>(environment.apiHost + "user/login", auth);
  }

  getRole(): any {
    // if (this.isLoggedIn()) {
    //   const accessToken: any = localStorage.getItem('user');
    //   const helper = new JwtHelperService();
    //   const role = helper.decodeToken(accessToken).role[0].authority;
    //   return role;
    // }
    return null;
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('user') != null) {
      return true;
    }
    return false;
  }

  setUser(): void {
    this.user$.next(this.getRole());
  }

}
