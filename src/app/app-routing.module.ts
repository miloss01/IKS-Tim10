import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RegisterAccountComponent } from './components/register-account/register-account.component';

const routes: Routes = [
  {path:'register-account', component: RegisterAccountComponent},
  {path:'home', component: LandingPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
