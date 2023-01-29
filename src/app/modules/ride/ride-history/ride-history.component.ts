import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AppUser, Ride } from 'src/app/models/models';
import { RideServiceService } from '../service/ride-service.service';
import { RideDetailsDialogComponent } from './ride-details-dialog/ride-details-dialog.component';
import { RideHistoryServiceService } from './service/ride-history-service.service';
import { ManageDriversService } from '../../app-user/manage-drivers/service/manage-drivers.service';
import { LoginAuthentificationService } from '../../auth/service/login-authentification.service';
import { ManagePassengersService } from '../../app-user/manage-passengers/service/manage-passengers.service';

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

  public currentPage = 0;
  public pageSize:number = 10;
  public length:number = 0;

  private userId = -1;

  constructor(private route: ActivatedRoute,
    private rideService: RideServiceService,
    private manageDriversService: ManageDriversService,
    private managePassengersService: ManagePassengersService,
    private authService: LoginAuthentificationService,
    public rideDetailsDialog: MatDialog,) { }

  ngOnInit() {
    if(this.authService.getRole() == "ADMIN") {
      this.manageDriversService.selectedIdValue$.subscribe((value) => {
        console.log(value);
        this.userId = value;
        console.log("user id dobijen je iz drivers manage service");
      });
      this.managePassengersService.selectedIdValue$.subscribe((value) => {
        console.log(value);
        this.userId = value;
        console.log("user id dobijen je iz passengers manage service");
      })
    } else {
      this.userId = this.authService.getId();
      console.log("user id dobijen je iz login service");
    }
    this.getRides();
  }

  viewRideDetails(ride : Ride) {
    const rideDetailsDialog = this.rideDetailsDialog.open(RideDetailsDialogComponent, {
      width: '900px',
      height: '500px',
      data: { ride: ride }
    });
  }

  public convertToDate(string : string) : Date {
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
       console.log(comparatorResult);
       return comparatorResult * (sort.direction == 'asc' ? 1 : -1);
      });
    };
    return sortFunction;
   }

   private orderByDateDescending() {
    this.dataSource.sort = this.sort;

    const sortState: Sort = {active: 'startTime', direction: 'desc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
   }

  public handlePage(event?:any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.pageIteration();
    this.dataSource.sort = this.sort;
  }

  public getRides(){
  this.rideService
    .getAllUserRides(this.userId)
    .subscribe((res:ridesDTO) => {
      console.log("Iz ride history comp user id je: " + this.userId);
      this.dataSource = new MatTableDataSource<Ride>(res.results);
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
      this.dataSource.sortData = this.enableSortByAnyColumn();
      this.rides = res.results;
      this.length = this.rides.length;
      this.pageIteration();
      this.dataSource.sort = this.sort;
      this.orderByDateDescending();
      })
  };

  private pageIteration() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.rides.slice(start, end);
    this.dataSource = new MatTableDataSource<Ride>(part);
  }

}



export interface ridesDTO{
  totalCount: number,
  results: Ride[]
}

