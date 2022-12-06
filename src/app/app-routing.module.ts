import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterAccountComponent } from './components/register-account/register-account.component';
import { BasicUserInformationComponent } from './components/basic-user-information/basic-user-information.component';
import { PassengerUserInfoComponent } from './components/passenger-user-info/passenger-user-info.component';

const routes: Routes = [
  {path:'register-account', component: RegisterAccountComponent},
  {path:'login', component: LoginComponent},
  {path: 'passenger-account', component: PassengerUserInfoComponent},
  {path: '**', component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
