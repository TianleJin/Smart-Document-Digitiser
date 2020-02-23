
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackComponent } from './track/track.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'admin',
    component: AdminComponent
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
