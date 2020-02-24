

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackComponent } from './track/track.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';

import { AuthGuardService} from '@app/auth-guard/auth-guard.service';
import { Role } from './_models'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuardService],
    data: { roles: [Role.Admin]}
  },
  {
    path: 'track',
    component: TrackComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**', redirectTo: ''
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
