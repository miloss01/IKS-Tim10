import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUserService } from 'src/app/services/app-user.service';
import { AppUser } from 'src/app/modules/app-user/account/basic-user-information/basic-user-information.component';
import { BlockDialogComponent } from 'src/app/modules/layout/dialogs/block-dialog/block-dialog.component';
import { ManageDriversService } from './service/manage-drivers.service';
import { RideHistoryServiceService } from '../../ride/ride-history/service/ride-history-service.service';
import { UserServiceService } from '../account/services/user.service';

@Component({
  selector: 'app-manage-drivers',
  templateUrl: './manage-drivers.component.html',
  styleUrls: ['./manage-drivers.component.css']
})
export class ManageDriversComponent implements OnInit {

  accounts: AppUser[] = [];

  constructor(
    public blockDialog: MatDialog,
    private route: ActivatedRoute,
    private appUserService: AppUserService,
    private accountService: UserServiceService,
    private manageService: ManageDriversService,
    private rideHistoryService: RideHistoryServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.manageService
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
    this.router.navigate(['driver-account-details']);
  }

}

interface accountsDTO{
  totalCount: number,
  results: AppUser[]
}