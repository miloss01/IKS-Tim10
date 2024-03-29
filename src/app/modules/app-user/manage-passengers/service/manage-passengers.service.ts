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
    return this.authService.getRole() == "ADMIN";
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

  submitNote(userId: number, message: string): Observable<any>{
    const options: any = {
      responseType: 'json',
    };
    return this.http.post<NoteDTO>(environment.apiHost + "user/" + userId + '/note', {message}, options);

  }

  getNotes(userId: number): Observable<any> {
    return this.http.get<NotesDTO>(environment.apiHost + "user/" + userId + "/note");

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

export interface NoteMessageDTO {
  messsage: string
}

export interface NoteDTO {
  id: number;
  date: string;
  message: string;
}

export interface NotesDTO {
  totalCount: number;
  results: NoteDTO[];
}