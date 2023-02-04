import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RideHistoryServiceService } from 'src/app/modules/ride/ride-history/service/ride-history-service.service';
import { AppUserService } from 'src/app/services/app-user.service';
import { UserServiceService } from '../../../account/services/user.service';
import { NotesComponent } from '../../../manage-passengers/notes/notes.component';
import { ManageDriversService } from '../../service/manage-drivers.service';

@Component({
  selector: 'app-driver-account-details',
  templateUrl: './driver-account-details.component.html',
  styleUrls: ['./driver-account-details.component.css']
})
export class DriverAccountDetailsComponent implements OnInit {

  constructor(
    private appUserService: UserServiceService,
    private manageService: ManageDriversService,
    private snackBar: MatSnackBar,
    public notesDialog: MatDialog
    ) { }

  private userId = -1;
  isBlocked = false;

  ngOnInit(): void {
    this.manageService.selectedIdValue$.subscribe((value) => {
      this.userId = value;
      console.log("DRIVER ACC DETAILS USER ID: " + this.userId);
      this.manageService.isBlocked(this.userId).subscribe((value) => {
        console.log("Blocked status on init: " + JSON.stringify(value));
        this.isBlocked = value.blocked;
        console.log("DRIVER ACC DETAILS IS BLOCKED: " + this.isBlocked);
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

  openNoteDialog() {
    const notesDialog = this.notesDialog.open(NotesComponent, {
      width: '800px',
      height: '500px',
      data: { userId: this.userId }
    });
  }
  
}
