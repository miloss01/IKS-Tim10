import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FavoriteRouteDTO } from 'src/app/models/models';
import { RideServiceService } from '../../ride/service/ride-service.service';

@Component({
  selector: 'app-favorite-routes',
  templateUrl: './favorite-routes.component.html',
  styleUrls: ['./favorite-routes.component.css']
})
export class FavoriteRoutesComponent implements OnInit {

  constructor(
    private rideService: RideServiceService,
    private route: ActivatedRoute,
    private readonly router: Router
    ) { }

  favorites: FavoriteRouteDTO[] = []

  private deleted$ = new BehaviorSubject<any>({});
  selectedValue$ = this.deleted$.asObservable();

  setValue(test: any) {
    this.deleted$.next(test);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.rideService
      .getFavoriteRoutes()
      .subscribe((res:FavoriteRouteDTO[]) => {
        this.favorites = res;
        for (let fav of this.favorites) {
        }
        })
    });
  }

  clickRideAgain(favorite: FavoriteRouteDTO): void {
    this.rideService.setbookAgainValue(favorite);
    this.router.navigate(['/book-ride']);
  }

  clickDelete(favorite: FavoriteRouteDTO): void {
    if (confirm("Confirm deleting?")) {
      this.rideService.deleteFavoriteRoute(favorite).subscribe(res => {
        this.setValue("deleted")
        this.deleted$.subscribe((value) => {
          this.favorites.forEach( (item, index) => {
            if(item === favorite) this.favorites.splice(index,1);
          });
        })
      })
    }
  }

}

