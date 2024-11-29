import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

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
import { ListaUsuariosComponent } from './components/administrador/lista-usuarios/lista-usuarios.component';
import { EditarUsuarioComponent } from './components/administrador/editar-usuario/editar-usuario.component';


/* Componentes de Operador  */
import { DashboardOperadorComponent } from './components/operador/dashboard-operador/dashboard-operador.component';
import { ListaMedicosComponent } from './components/operador/lista-medicos/lista-medicos.component';
import { CrearPacienteComponent } from './components/operador/crear-paciente/crear-paciente.component';
import { AsignarTurnoComponent } from './components/operador/asignar-turno/asignar-turno.component';
import { AgendaMedicoComponent } from './components/operador/agenda-medico/agenda-medico.component';
import { VerTurnosComponent } from './components/operador/ver-turnos/ver-turnos.component';
import { EditarAgendaComponent } from './components/operador/editar-agenda/editar-agenda.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'home', component: HomeComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'dashboard', component: DashboardComponent },
  { path: 'paciente/nuevo-turno', component: NuevoTurnoComponent },
  { path: 'paciente/mis-turnos', component: MisTurnosComponent },
  { path: 'paciente/mis-datos', component: MisDatosComponent }, 
  /* { path: 'administrador/crear-usuario', component: CrearUsuarioComponent },
  { path: 'administrador/lista-usuarios', component: ListaUsuariosComponent },
  { path: 'administrador/editar-usuario/:id', component: EditarUsuarioComponent }, */
  { path: 'medico/gestion-agenda', component: GestionAgendaComponent },
  { path: 'medico/turnos-programados', component: TurnosProgramadosComponent },
  
  {
    path: 'operador',
    component: DashboardOperadorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['operador'] },
    children: [
      { path: '', redirectTo: 'agenda-medicos', pathMatch: 'full' },
      { path: 'agenda-medicos', component: AgendaMedicoComponent },
      { path: 'crear-paciente', component: CrearPacienteComponent },
      { path: 'lista-medicos', component: ListaMedicosComponent },
      { path: 'asignar-turno', component: AsignarTurnoComponent },
      { 
        path: 'agenda', 
        children: [
          { path: 'editar/:id_medico/:fecha', component: EditarAgendaComponent },
          { path: 'turnos/:id_medico/:fecha', component: VerTurnosComponent }
        ]
      }
    ]
  },
  {
    path: 'administrador',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'crear-usuario', component: CrearUsuarioComponent },
      { path: 'lista-usuarios', component: ListaUsuariosComponent },
      { path: 'gestion-usuarios', component: ListaUsuariosComponent },
      { path: 'editar-usuario/:id', component: EditarUsuarioComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
