import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookRideComponent } from './book-ride/book-ride.component';
import { AppRoutingModule } from 'src/app/infrastructure/app-routing.module';
import { AppUserModule } from '../app-user/app-user.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { LayoutModule } from '../layout/layout.module';
import { HttpClientModule } from '@angular/common/http';
import { ObserversModule } from '@angular/cdk/observers';

@NgModule({
  declarations: [BookRideComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    LayoutModule,
    AppUserModule,
    ObserversModule,
  ],
  exports: [BookRideComponent]
})
export class RideModule { }