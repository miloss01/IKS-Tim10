import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CancelDialogComponent } from '../../layout/dialogs/cancel-dialog/cancel-dialog.component';
import { MapComponent } from '../../layout/map/map.component';

@Component({
  selector: 'app-ride-request',
  templateUrl: './ride-request.component.html',
  styleUrls: ['./ride-request.component.css']
})
export class RideRequestComponent implements OnInit {
  @ViewChild(MapComponent, {static : true}) map : MapComponent | undefined;


  constructor(public declineDialog: MatDialog, private http: HttpClient) { }

  ngOnInit(): void {
  }
  getLatLong(address: string): Observable<any> {
    return this.http.get("https://nominatim.openstreetmap.org/search?format=json&q=" + address);
  }

  startRide(): void {

  }

  declineRide(): void {
    const dialogRef = this.declineDialog.open(CancelDialogComponent);
  }

}
