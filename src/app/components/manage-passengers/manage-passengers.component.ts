import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AppUserService } from 'src/app/services/app-user.service';
import { BlockDialogComponent } from '../dialogs/block-dialog/block-dialog.component';
import { AppUser } from '../user-account/basic-user-information/basic-user-information.component';

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
    private appUserService: AppUserService
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

  blockUser(id: number): void {
    BlockDialogComponent.userId = id;
    const dialogRef = this.blockDialog.open(BlockDialogComponent);
  }

}

export interface accountsDTO{
  totalCount: number,
  results: AppUser[]
}