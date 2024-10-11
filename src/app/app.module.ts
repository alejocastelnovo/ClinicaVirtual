import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


/* Componentes vistas */
import { LoginComponent } from './components/login/login.component';

/* Angular Material */
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon'; 
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatOptionModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Forms */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* HTTP Client para llamadas HTTP */
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegistroComponent } from './components/registro/registro.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';  // Necesario para trabajar con servicios HTTP
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NuevoTurnoComponent } from './components/paciente/nuevo-turno/nuevo-turno.component';
import { MisTurnosComponent } from './components/paciente/mis-turnos/mis-turnos.component';
import { MisDatosComponent } from './components/paciente/mis-datos/mis-datos.component';
import { TurnosProgramadosComponent } from './components/medico/turnos-programados/turnos-programados.component';
import { GestionAgendaComponent } from './components/medico/gestion-agenda/gestion-agenda.component';
import { GestionUsuariosComponent } from './components/administrador/gestion-usuarios/gestion-usuarios.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    RegistroComponent,
    HomeComponent,
    DashboardComponent,
    NuevoTurnoComponent,
    MisTurnosComponent,
    MisDatosComponent,
    TurnosProgramadosComponent,
    GestionAgendaComponent,
    GestionUsuariosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    BrowserAnimationsModule,  // Necesario para Angular Material
    MatCardModule,  // Tarjetas de Angular Material
    MatFormFieldModule,  // Formularios y campos de texto
    MatInputModule,  // Inputs de Material
    MatButtonModule,  // Botones estilizados de Material
    MatIconModule,  // Íconos si los usas en el proyecto
    FormsModule,  // Para formularios con ngModel
    ReactiveFormsModule,  // Para formularios reactivos si decides usarlos
    HttpClientModule,  // Para las peticiones HTTP (ej: login)
    MatSnackBarModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
