import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookRideComponent } from '../modules/ride/book-ride/book-ride.component';
import { LandingPageComponent } from '../modules/layout/landing-page/landing-page.component';
import { LoginComponent } from '../modules/auth/login/login.component';
import { RegisterAccountComponent } from '../modules/app-user/register-account/register-account.component';
import { RegisterDriverComponent } from '../modules/app-user/register-driver/register-driver.component';
import { PassengerUserInfoComponent } from '../modules/app-user/account/passenger-user-info/passenger-user-info.component';
import { DriverUserInfoComponent } from '../modules/app-user/account/driver-user-info/driver-user-info.component';
import { ManagePassengersComponent } from '../modules/app-user/manage-passengers/manage-passengers.component';
import { ManageDriversComponent } from '../modules/app-user/manage-drivers/manage-drivers.component';
import { RideRequestComponent } from '../modules/ride/ride-request/ride-request.component';
import { CurrentRideComponent } from '../modules/ride/current-ride/current-ride.component';

const routes: Routes = [
  {path:'register-account', component: RegisterAccountComponent},
  {path:'login', component: LoginComponent},
  {path:'register-driver', component: RegisterDriverComponent},
  {path: 'passenger-account', component: PassengerUserInfoComponent},
  {path: "driver-account", component: DriverUserInfoComponent},
  {path: 'book-ride', component: BookRideComponent},
  {path: 'manage-drivers', component: ManageDriversComponent},
  {path: 'manage-passengers', component: ManagePassengersComponent},
  {path: "ride-request", component:RideRequestComponent},
  {path: 'current-ride', component: CurrentRideComponent},
  {path: '**', component: LandingPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
