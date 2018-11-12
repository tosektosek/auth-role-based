import { UnauthorizedErrorComponent } from './unauthorized-error/unauthorized-error.component';
import { LoginGuardService } from './login-guard.service';
import { ProfileSelectionComponent } from './profile-selection/profile-selection.component';
import { AuthGuardService } from './auth-guard.service';
import { DoctorComponent } from './doctor/doctor.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientComponent } from './patient/patient.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: '', component: ProfileSelectionComponent},
  {path: '401', component: UnauthorizedErrorComponent},
  {path: 'doctor', component: DoctorComponent, canActivate: [AuthGuardService], data: {role: 'doctor'}},
  {path: 'patient', component: PatientComponent, canActivate: [AuthGuardService], data: {role: 'patient'}},
  {path: 'login', component: LoginComponent, canActivate: [LoginGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
