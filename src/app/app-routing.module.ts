import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookRideComponent } from './components/book-ride/book-ride.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterAccountComponent } from './components/register-account/register-account.component';
import { PassengerUserInfoComponent } from './components/user-account/passenger-user-info/passenger-user-info.component';
import { DriverUserInfoComponent } from './components/user-account/driver-user-info/driver-user-info.component';

const routes: Routes = [
  {path:'register-account', component: RegisterAccountComponent},
  {path:'login', component: LoginComponent},
  {path: 'passenger-account', component: PassengerUserInfoComponent},
  {path: "driver-account", component: DriverUserInfoComponent},
  {path: 'book-ride', component: BookRideComponent},
  {path: '**', component: LandingPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
