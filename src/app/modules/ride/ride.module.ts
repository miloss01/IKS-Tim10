import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BookRideComponent } from './book-ride/book-ride.component'
import { AppRoutingModule } from 'src/app/infrastructure/app-routing.module'
import { AppUserModule } from '../app-user/app-user.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MaterialModule } from 'src/app/infrastructure/material/material.module'
import { LayoutModule } from '../layout/layout.module'
import { HttpClientModule } from '@angular/common/http'
import { ObserversModule } from '@angular/cdk/observers'
import { RideRequestComponent } from './ride-request/ride-request.component'
import { CurrentRideComponent } from './current-ride/current-ride.component'
import { RideHistoryComponent } from './ride-history/ride-history.component'
import { RideDetailsDialogComponent } from './ride-history/ride-details-dialog/ride-details-dialog.component'

@NgModule({
  declarations: [BookRideComponent, RideRequestComponent, CurrentRideComponent, RideHistoryComponent, RideDetailsDialogComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    LayoutModule,
    AppUserModule,
    ObserversModule
  ],
  exports: [BookRideComponent, RideRequestComponent]
})
export class RideModule { }
