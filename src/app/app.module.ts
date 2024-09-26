import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


/* Componentes */

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NuevoTurnoComponent } from './components/paciente/nuevo-turno/nuevo-turno.component';
import { MisTurnosComponent } from './components/paciente/mis-turnos/mis-turnos.component';
import { MisDatosComponent } from './components/paciente/mis-datos/mis-datos.component';
import { TurnosProgramadosComponent } from './components/medico/turnos-programados/turnos-programados.component';
import { GestionAgendaComponent } from './components/medico/gestion-agenda/gestion-agenda.component';
import { GestionarPacientesTurnosComponent } from './components/operador/gestionar-pacientes-turnos/gestionar-pacientes-turnos.component';
import { GestionarUsuariosComponent } from './components/admin/gestionar-usuarios/gestionar-usuarios.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    NuevoTurnoComponent,
    MisTurnosComponent,
    MisDatosComponent,
    TurnosProgramadosComponent,
    GestionAgendaComponent,
    GestionarPacientesTurnosComponent,
    GestionarUsuariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
