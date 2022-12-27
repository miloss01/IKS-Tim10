import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServiceService } from '../../account/services/user.service';
import { ManagePassengersService } from '../service/manage-passengers.service';

@Component({
  selector: 'app-passenger-account-details',
  templateUrl: './passenger-account-details.component.html',
  styleUrls: ['./passenger-account-details.component.css']
})
export class PassengerAccountDetailsComponent implements OnInit {

  constructor(
    private appUserService: UserServiceService,
    private manageService: ManagePassengersService,
    private snackBar: MatSnackBar
    ) { }

  private userId = -1;
  isBlocked = false;

  ngOnInit(): void {
    this.manageService.selectedIdValue$.subscribe((value) => {
      this.userId = value;
      console.log("PASSENGER ACC DETAILS USER ID: " + this.userId);
      this.manageService.isBlocked(this.userId).subscribe((value) => {
        console.log("Blocked status on init: " + JSON.stringify(value));
        this.isBlocked = value.blocked;
        console.log("PASSENGER ACC DETAILS IS BLOCKED: " + this.isBlocked);
      })
    });
  }

  onBlockClick(): void {
    this.manageService.blockUser(this.userId).subscribe((value) => {
      this.isBlocked = true;
      this.manageService.isBlocked(this.userId).subscribe((value) => {
        console.log("Blocked status after click on button: " + JSON.stringify(value));
      })
      this.snackBar.open("Successfully blocked", "Close");
    })
  }

  onUnblockClick(): void {
    this.manageService.unblockUser(this.userId).subscribe((value) => {
      console.log(value);
      this.isBlocked = false;
      this.manageService.isBlocked(this.userId).subscribe((value) => {
        console.log("Blocked status after click on button: " + JSON.stringify(value));
      })
      this.snackBar.open("Successfully unblocked", "Close");
    })
  }

}
