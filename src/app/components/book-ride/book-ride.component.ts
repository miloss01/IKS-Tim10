import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InviteDialogComponent } from '../dialogs/invite-dialog/invite-dialog.component';

interface VehicleType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-book-ride',
  templateUrl: './book-ride.component.html',
  styleUrls: ['./book-ride.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BookRideComponent implements OnInit {

  foods: VehicleType[] = [
    {value: 'STANDARD', viewValue: 'Standard'},
    {value: 'LUXURY', viewValue: 'Luxury'},
    {value: 'VAN', viewValue: 'Van'},
  ];

  constructor(public invDialog: MatDialog) { }

  ngOnInit(): void {
  }

  invite(): void {
    const dialogRef = this.invDialog.open(InviteDialogComponent);
  }

}
