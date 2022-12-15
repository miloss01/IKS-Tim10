import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './infrastructure/app-routing.module';

import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './infrastructure/material/material.module';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';


import { AuthModule } from './modules/auth/auth.module';
import { LayoutModule } from './modules/layout/layout.module';
import { AppUserModule } from './modules/app-user/app-user.module';
import { RideModule } from './modules/ride/ride.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    AuthModule,
    LayoutModule,
    AppUserModule,
    RideModule
  ],
  providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
