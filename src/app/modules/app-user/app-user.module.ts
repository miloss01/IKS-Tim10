import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppUserService } from 'src/app/services/app-user.service';
import { RegisterAccountComponent } from './register-account/register-account.component';
import { AppRoutingModule } from 'src/app/infrastructure/app-routing.module';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RegisterDriverComponent } from './register-driver/register-driver.component';
import { ManagePassengersComponent } from './manage-passengers/manage-passengers.component';
import { ManageDriversComponent } from './manage-drivers/manage-drivers.component';
import { LayoutModule } from '@angular/cdk/layout';
import { DriverDocumentsComponent } from './account/driver-documents/driver-documents.component';
import { DriverVechicleComponent } from './account/driver-vechicle/driver-vechicle.component';
import { BasicUserInformationComponent } from './account/basic-user-information/basic-user-information.component';
import { UserServiceService } from './account/services/user.service';
import { DriverUserInfoComponent } from './account/driver-user-info/driver-user-info.component';
import { PassengerOtherAccInfoComponent } from './account/passenger-other-acc-info/passenger-other-acc-info.component';
import { PassengerUserInfoComponent } from './account/passenger-user-info/passenger-user-info.component';

@NgModule({
  declarations: [RegisterAccountComponent, 
    RegisterDriverComponent, 
    ManagePassengersComponent, 
    ManageDriversComponent,
    DriverDocumentsComponent,
    DriverVechicleComponent,
    DriverUserInfoComponent,
    BasicUserInformationComponent,
    PassengerOtherAccInfoComponent,
    PassengerUserInfoComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule,
    LayoutModule
  ],
  providers:[UserServiceService],
  exports: [RegisterAccountComponent, 
    RegisterDriverComponent, 
    ManagePassengersComponent, 
    ManageDriversComponent,
    DriverDocumentsComponent,
    DriverVechicleComponent,
    DriverUserInfoComponent,
    BasicUserInformationComponent,
    PassengerOtherAccInfoComponent,
    PassengerUserInfoComponent]
})
export class AppUserModule { }