import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUserService } from 'src/app/services/app-user.service';
import { BlockDialogComponent } from 'src/app/modules/layout/dialogs/block-dialog/block-dialog.component';
import { AppUser } from 'src/app/modules/app-user/account/basic-user-information/basic-user-information.component';
import { ManagePassengersService } from './service/manage-passengers.service';
import { RideHistoryServiceService } from '../../ride/ride-history/service/ride-history-service.service';
import { UserServiceService } from '../account/services/user.service';

@Component({
  selector: 'app-manage-passengers',
  templateUrl: './manage-passengers.component.html',
  styleUrls: ['./manage-passengers.component.css']
})
export class ManagePassengersComponent implements OnInit {

  accounts: AppUser[] = [];

  constructor(
    public blockDialog: MatDialog,
    private route: ActivatedRoute,
    private appUserService: AppUserService,
    private accountService: UserServiceService,
    private manageService: ManagePassengersService,
    private rideHistoryService: RideHistoryServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.appUserService
      .getAll()
      .subscribe((res:accountsDTO) => {
        this.accounts = res.results;
        })
    });
  }

  viewDetails(userId: number): void {
    this.manageService.setIdValue(userId);
    this.rideHistoryService.setUserIdValue(userId);
    this.accountService.setValue(userId);
    this.router.navigate(['passenger-account-details']);
  }

}

export interface accountsDTO{
  totalCount: number,
  results: AppUser[]
}