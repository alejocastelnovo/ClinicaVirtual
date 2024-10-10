import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

/* Componentes de Paciente */
import { NuevoTurnoComponent } from './components/paciente/nuevo-turno/nuevo-turno.component';
import { MisTurnosComponent } from './components/paciente/mis-turnos/mis-turnos.component';
import { MisDatosComponent } from './components/paciente/mis-datos/mis-datos.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'home', component: HomeComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'dashboard', component: DashboardComponent },
  { path: 'paciente/nuevo-turno', component: NuevoTurnoComponent },
  { path: 'paciente/mis-turnos', component: MisTurnosComponent },
  { path: 'paciente/mis-datos', component: MisDatosComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
