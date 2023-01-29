import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppUserForRide, Review, ReviewRequest, RideReview } from 'src/app/models/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  
  constructor(private http: HttpClient) { }

  getReviews(rideId: number) {
    return this.http.get<RideReview[]>(environment.apiHost + "review/" + rideId);
  }

  saveDriverReview(rideId: number, review: ReviewRequest) {
    const options: any = {
      responseType: 'text',
    };
    return this.http.post<ReviewRequest>(environment.apiHost + "review/" + rideId + '/driver', {comment: review.comment, rating: review.rating}, options);
  }

  saveVehicleReview(rideId: number, review: ReviewRequest) {
    const options: any = {
      responseType: 'text',
    };
    return this.http.post<ReviewRequest>(environment.apiHost + "review/" + rideId + '/vehicle', {comment: review.comment, rating: review.rating}, options);
  }

}

export interface RideReviewsDTO {
  reviews : RideReview[];
}

