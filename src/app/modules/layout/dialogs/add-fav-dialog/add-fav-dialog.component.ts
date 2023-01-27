import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FavoriteRouteDTO } from 'src/app/models/models';
import { RideServiceService } from 'src/app/modules/ride/service/ride-service.service';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-add-fav-dialog',
  templateUrl: './add-fav-dialog.component.html',
  styleUrls: ['./add-fav-dialog.component.css']
})
export class AddFavDialogComponent implements OnInit {

  name: string = ""
  public favorite : FavoriteRouteDTO

  constructor(
    public dialogRef: MatDialogRef<AddFavDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private snackBar: MatSnackBar,
    private rideService: RideServiceService
  ) {
    this.favorite = data["favorite"]
   }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.name === "") {
      this.snackBar.open("Please enter favorite's name.", "Close")
      return
    }
    this.favorite.favoriteName = this.name
    this.rideService.saveFavoriteRoute(this.favorite).subscribe(res => {
      this.snackBar.open("Favorite saved!", "Close");
      this.dialogRef.close();
    },
     err => {
      this.snackBar.open("Number of favorites can't exceed 10.", "Close");
    }) 
  }

}
