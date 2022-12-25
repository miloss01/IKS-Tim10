import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppUserForRide, RideReview } from 'src/app/models/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  
  constructor(private http: HttpClient) { }

  getReviews(rideId: number) {
    return this.http.get<RideReview[]>(environment.apiHost + "review/" + rideId);
  }
}

export interface RideReviewsDTO {
  reviews : RideReview[];
}

