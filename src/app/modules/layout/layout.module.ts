import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { MapComponent } from './map/map.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AppRoutingModule } from 'src/app/infrastructure/app-routing.module';
import { Location, DepartureDestination, EstimateDataDTO } from 'src/app/models/models';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { BlockDialogComponent } from './dialogs/block-dialog/block-dialog.component';
import { InviteDialogComponent } from './dialogs/invite-dialog/invite-dialog.component';


@NgModule({
  declarations: [LandingPageComponent, 
    ToolbarComponent, 
    MapComponent,
    BlockDialogComponent,
    InviteDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule
  ],
  exports: [LandingPageComponent, 
    ToolbarComponent, 
    MapComponent,
    BlockDialogComponent,
    InviteDialogComponent]
})
export class LayoutModule { }
