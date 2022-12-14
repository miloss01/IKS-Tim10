import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterAccountComponent } from './components/register-account/register-account.component';
import { RegisterDriverComponent } from './components/register-driver/register-driver.component';

import { PassengerUserInfoComponent } from './components/user-account/passenger-user-info/passenger-user-info.component';
import { DriverUserInfoComponent } from './components/user-account/driver-user-info/driver-user-info.component';

const routes: Routes = [
  {path:'register-account', component: RegisterAccountComponent},
  {path:'login', component: LoginComponent},
  {path:'register-driver', component: RegisterDriverComponent},
  {path: 'passenger-account', component: PassengerUserInfoComponent},
  {path: "driver-account", component: DriverUserInfoComponent},
  {path: '**', component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
