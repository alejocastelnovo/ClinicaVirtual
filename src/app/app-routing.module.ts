import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/registro/registro.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

/* Componentes de Paciente */
import { NuevoTurnoComponent } from './components/paciente/nuevo-turno/nuevo-turno.component';
import { MisTurnosComponent } from './components/paciente/mis-turnos/mis-turnos.component';
import { MisDatosComponent } from './components/paciente/mis-datos/mis-datos.component';

/* Componentes de Medico */
import { GestionAgendaComponent } from './components/medico/gestion-agenda/gestion-agenda.component';
import { TurnosProgramadosComponent } from './components/medico/turnos-programados/turnos-programados.component';

/* Componentes de Administrador */
import { CrearUsuarioComponent } from './components/administrador/crear-usuario/crear-usuario.component';


/* Componentes de Operador  */
import { DashboardOperadorComponent } from './components/operador/dashboard-operador/dashboard-operador.component';
import { ListaMedicosComponent } from './components/operador/lista-medicos/lista-medicos.component';
import { ListaUsuariosComponent } from './components/administrador/lista-usuarios/lista-usuarios.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'home', component: HomeComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'dashboard', component: DashboardComponent },
  { path: 'paciente/nuevo-turno', component: NuevoTurnoComponent },
  { path: 'paciente/mis-turnos', component: MisTurnosComponent },
  { path: 'paciente/mis-datos', component: MisDatosComponent }, 
  { path: 'administrador/crear-usuario', component: CrearUsuarioComponent },
  { path: 'administrador/lista-usuarios', component: ListaUsuariosComponent},
  { path: 'medico/gestion-agenda', component: GestionAgendaComponent },
  { path: 'medico/turnos-programados', component: TurnosProgramadosComponent },
  { path: 'operador/dashboard-operador', component: DashboardOperadorComponent },
  { path: 'operador/lista-medicos', component: ListaMedicosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
