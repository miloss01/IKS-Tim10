import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BookRideComponent } from '../modules/ride/book-ride/book-ride.component'
import { LandingPageComponent } from '../modules/layout/landing-page/landing-page.component'
import { LoginComponent } from '../modules/auth/login/login.component'
import { RegisterAccountComponent } from '../modules/app-user/register-account/register-account.component'
import { RegisterDriverComponent } from '../modules/app-user/register-driver/register-driver.component'
import { PassengerUserInfoComponent } from '../modules/app-user/account/passenger-user-info/passenger-user-info.component'
import { DriverUserInfoComponent } from '../modules/app-user/account/driver-user-info/driver-user-info.component'
import { ManagePassengersComponent } from '../modules/app-user/manage-passengers/manage-passengers.component'
import { ManageDriversComponent } from '../modules/app-user/manage-drivers/manage-drivers.component'
import { RideRequestComponent } from '../modules/ride/ride-request/ride-request.component'
import { CurrentRideComponent } from '../modules/ride/current-ride/current-ride.component'
import { RideHistoryComponent } from '../modules/ride/ride-history/ride-history.component'
import { DriverAccountDetailsComponent } from '../modules/app-user/manage-drivers/account-details/driver-account-details/driver-account-details.component'
import { PassengerAccountDetailsComponent } from '../modules/app-user/manage-passengers/account-details/passenger-account-details.component'
import { ManageChangeRequestComponent } from '../modules/app-user/manage-change-request/manage-change-request.component'
// import { ChangeRequestInfoComponent } from '../modules/app-user/change-request-info/change-request-info.component';
import { UserStatisticsComponent } from '../modules/app-user/user-statistics/user-statistics.component'
import { TokenGuard } from './guard/token.guard'
import { RoleGuard } from './guard/role.guard'
import { UnregisteredGuard } from './guard/unregistered.guard'
import { ChatComponent } from '../modules/app-user/chat/chat.component'
import { FavoriteRoutesComponent } from '../modules/app-user/favorite-routes/favorite-routes.component'

const pass: string[] = ["PASSENGER"]
const driver: string[] = ["DRIVER"]
const admin: string[] = ["ADMIN"]
const pass_driver: string[] = ["PASSENGER", "DRIVER"]
const pass_admin: string[] = ["PASSENGER", "ADMIN"]
const driver_admin: string[] = ["DRIVER", "ADMIN"]
const all: string[] = ["PASSENGER", "DRIVER", "ADMIN"]

const routes: Routes = [
  { path: 'register-account', component: RegisterAccountComponent, canActivate: [UnregisteredGuard] },

  { path: 'login', component: LoginComponent, canActivate: [UnregisteredGuard] },

  { path: 'register-driver', component: RegisterDriverComponent, canActivate: [TokenGuard, RoleGuard], data: {roles: admin} },

  { path: 'passenger-account', component: PassengerUserInfoComponent, canActivate: [TokenGuard, RoleGuard], data: {roles: pass} },

  { path: "driver-account", component: DriverUserInfoComponent, canActivate: [TokenGuard, RoleGuard], data: {roles: driver} },
  // nije namesteno, jer se za sada driver i admin ovde vracaju
  { path: 'book-ride', component: BookRideComponent, canActivate: [TokenGuard] },

  { path: 'manage-drivers', component: ManageDriversComponent, canActivate: [TokenGuard, RoleGuard], data: {roles: admin} },

  { path: 'manage-passengers', component: ManagePassengersComponent, canActivate: [TokenGuard, RoleGuard], data: {roles: admin} },
  // nisam siguran za sta je komponenta
  { path: "ride-request", component:RideRequestComponent, canActivate: [TokenGuard] },

  { path: 'current-ride', component: CurrentRideComponent, canActivate: [TokenGuard, RoleGuard], data: {roles: pass_driver} },
  // nisam siguran da li ce i admin ici na ovu stranicu
  { path: 'ride-history', component: RideHistoryComponent, canActivate: [TokenGuard] },
  // nisam siguran da li je ovo samo za admina
  { path: 'driver-account-details', component: DriverAccountDetailsComponent, canActivate: [TokenGuard] },
  // nisam siguran da li je ovo samo za admina
  { path: 'passenger-account-details', component: PassengerAccountDetailsComponent, canActivate: [TokenGuard] },

  {path: 'favorite-routes', component: FavoriteRoutesComponent, canActivate: [TokenGuard, RoleGuard], data: {roles: pass}},

  { path: 'manage-change-requests', component: ManageChangeRequestComponent, canActivate: [TokenGuard, RoleGuard ], data: {roles: admin} },

  { path: 'statistics', component: UserStatisticsComponent, canActivate: [TokenGuard] },

  { path: 'chat', component: ChatComponent, canActivate: [TokenGuard] },

  { path: '**', component: LandingPageComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [TokenGuard, RoleGuard, UnregisteredGuard]
})
export class AppRoutingModule { }
