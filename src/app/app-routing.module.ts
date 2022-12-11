import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookRideComponent } from './components/book-ride/book-ride.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterAccountComponent } from './components/register-account/register-account.component';


const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'register-account', component: RegisterAccountComponent },
  { path: 'login', component: LoginComponent },
  { path: 'book-ride', component: BookRideComponent },
  { path: '**', component: LandingPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
