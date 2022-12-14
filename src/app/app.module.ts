import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './infrastructure/material/material.module';

import { LoginComponent } from './components/login/login.component';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { RegisterAccountComponent } from './components/register-account/register-account.component';
import { HomeComponent } from './components/home/home.component';

import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RegisterDriverComponent } from './components/register-driver/register-driver.component';
import { AppUserComponent } from './appUser/app-user/app-user.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BookRideComponent } from './components/book-ride/book-ride.component';
import { InviteDialogComponent } from './components/dialogs/invite-dialog/invite-dialog.component';
import { MapComponent } from './components/map/map.component';
import { BasicUserInformationComponent } from './components/user-account/basic-user-information/basic-user-information.component';
import { PassengerUserInfoComponent } from './components/user-account/passenger-user-info/passenger-user-info.component';
import { PassengerOtherAccInfoComponent } from './components/user-account/passenger-other-acc-info/passenger-other-acc-info.component';
import { DriverUserInfoComponent } from './components/user-account/driver-user-info/driver-user-info.component';
import { DriverVechicleComponent } from './components/user-account/driver-vechicle/driver-vechicle.component';
import { DriverDocumentsComponent } from './components/user-account/driver-documents/driver-documents.component';
import { ManageAccountsComponent } from './components/manage-accounts/manage-accounts.component';
import { BlockDialogComponent } from './components/dialogs/block-dialog/block-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterAccountComponent,
    RegisterDriverComponent,
    ToolbarComponent,
    LandingPageComponent,
    HomeComponent,
    RegisterDriverComponent,
    AppUserComponent,
    BookRideComponent,
    InviteDialogComponent,
    MapComponent,
    BasicUserInformationComponent,
    PassengerUserInfoComponent,
    PassengerOtherAccInfoComponent,
    DriverUserInfoComponent,
    DriverVechicleComponent,
    DriverDocumentsComponent,
    ManageAccountsComponent,
    BlockDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
