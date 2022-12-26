import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RideHistoryServiceService {

  private userIdValue$ = new BehaviorSubject<any>({});
  selectedUserIdValue$ = this.userIdValue$.asObservable();

  setUserIdValue(id: number) {
    this.userIdValue$.next(id);
  }

  constructor() { }
}
