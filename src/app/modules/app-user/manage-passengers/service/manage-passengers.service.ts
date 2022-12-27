import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginAuthentificationService } from 'src/app/modules/auth/service/login-authentification.service';
import { environment } from 'src/environments/environment';
import { AppUser } from '../../account/basic-user-information/basic-user-information.component';
import { UserServiceService } from '../../account/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ManagePassengersService {

  private idValue$ = new BehaviorSubject<any>({});
  selectedIdValue$ = this.idValue$.asObservable();
  
  constructor(private http: HttpClient,
    private userService: UserServiceService,
    private authService: LoginAuthentificationService) 
    { }
  
  // if admin is logged in changing users accounts is disabled
  isChangingEnabled(): boolean {
    return this.authService.getRole() == 2;
  }

  setIdValue(id: any) {
    this.idValue$.next(id);
  }

  getAll(): Observable<accountsDTO> {
    return this.http.get<accountsDTO>(environment.apiHost + 'passenger');
  }

  blockUser(id: number): Observable<any> {
    const options: any = {
      responseType: 'text',
    };
    return this.http.put<string>(environment.apiHost + "user/" + id + '/block', {}, options);
  }

  unblockUser(id: number): Observable<any> {
    const options: any = {
      responseType: 'text',
    };
    return this.http.put<string>(environment.apiHost + "user/" + id + '/unblock', {}, options);
  }

  isBlocked(userId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', userId); 
    return this.http.get<isBlockedDTO>(environment.apiHost + 'user/isBlocked', {params: params});
  }

}


interface accountsDTO{
  totalCount: number,
  results: AppUser[]
}

interface isBlockedDTO {
  userId: number,
  isBlocked: boolean
}