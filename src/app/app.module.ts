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
import { BookRideComponent } from './components/book-ride/book-ride.component';
import { InviteDialogComponent } from './components/dialogs/invite-dialog/invite-dialog.component';
import { MapComponent } from './components/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterAccountComponent,
    ToolbarComponent,
    LandingPageComponent,
    HomeComponent,
    BookRideComponent,
    InviteDialogComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
