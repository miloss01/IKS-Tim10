import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AppUser, Ride } from 'src/app/models/models';
import { RideServiceService } from '../service/ride-service.service';
import { RideDetailsDialogComponent } from './ride-details-dialog/ride-details-dialog.component';

@Component({
  selector: 'app-ride-history',
  templateUrl: './ride-history.component.html',
  styleUrls: ['./ride-history.component.css']
})
export class RideHistoryComponent implements OnInit {

  displayedColumns: string[] = ['departure', 'destination', 'startTime', 'endTime'];
  dataSource!: MatTableDataSource<Ride>;
  rides: Ride[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute,
    private rideService: RideServiceService,
    public rideDetailsDialog: MatDialog,) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.rideService
      .getAllUserRides(1)
      .subscribe((res:ridesDTO) => {
        this.rides = res.results;

        this.dataSource = new MatTableDataSource<Ride>(this.rides);
        this.dataSource.paginator = this.paginator;

        this.dataSource.sortingDataAccessor = (element, property) => {
          switch(property) {
            case 'departure': return element.locations[0].departure.address; 
            case 'destination': return element.locations[0].destination.address; 
            case 'startTime': return element.startTime;
            case 'endTime': return element.endTime;            
            default: return property;
          }
        };
        this.dataSource.sort = this.sort;

        this.dataSource.sortData = this.enableSortByAnyColumn();
        this.orderByDateDescending();
        })
    });
  }

  viewRideDetails(ride : Ride) {
    const rideDetailsDialog = this.rideDetailsDialog.open(RideDetailsDialogComponent, {
      width: '900px',
      height: '500px',
      data: { ride: ride }
    });
  }

  convertToDate(string : string) : Date {
    const tokens = string.split(" ");
    const dates = tokens[0].split(".");
    const times = tokens[1].split(":")

    const date = new Date(+dates[2], +dates[1]-1, +dates[0], +times[0], +times[1]);
    return date;
  }

  enableSortByAnyColumn() {
    let sortFunction = 
    (items: Ride[], sort: MatSort): Ride[] =>  {
      if (!sort.active || sort.direction === '') {
        return items;
      }
     return items.sort((a: Ride, b: Ride) => {
       let comparatorResult = 0;
       switch (sort.active) {
         case 'startTime':
          if (this.convertToDate(a.startTime).getTime() < this.convertToDate(b.startTime).getTime()) comparatorResult = 1;
          else comparatorResult = -1;
          break;
        case 'endTime':
          if (this.convertToDate(a.startTime).getTime() < this.convertToDate(b.startTime).getTime()) comparatorResult = 1;
          else comparatorResult = -1;
          break;
        case 'departure':
        comparatorResult = a.locations[0].departure.address.localeCompare(b.locations[0].departure.address);
        break;
        case 'destination':
        comparatorResult = a.locations[0].destination.address.localeCompare(b.locations[0].destination.address);
        break;
       }
       return comparatorResult * (sort.direction == 'asc' ? 1 : -1);
      });
    };
    return sortFunction;
   }

   private orderByDateDescending() {
    this.dataSource.sort = this.sort;

    const sortState: Sort = {active: 'startTime', direction: 'asc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
   }

}


export interface ridesDTO{
  totalCount: number,
  results: Ride[]
}

