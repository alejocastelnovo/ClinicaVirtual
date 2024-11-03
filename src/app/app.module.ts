/* Principales */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';




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
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';


/* Forms */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* HTTP Client para llamadas HTTP */
import { HttpClientModule } from '@angular/common/http';

/* Componentes */
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegisterComponent } from './components/registro/registro.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NuevoTurnoComponent } from './components/paciente/nuevo-turno/nuevo-turno.component';
import { MisTurnosComponent } from './components/paciente/mis-turnos/mis-turnos.component';
import { MisDatosComponent } from './components/paciente/mis-datos/mis-datos.component';
import { TurnosProgramadosComponent } from './components/medico/turnos-programados/turnos-programados.component';
import { GestionAgendaComponent } from './components/medico/gestion-agenda/gestion-agenda.component';
import { CrearUsuarioComponent } from './components/administrador/crear-usuario/crear-usuario.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    NuevoTurnoComponent,
    MisTurnosComponent,
    MisDatosComponent,
    TurnosProgramadosComponent,
    GestionAgendaComponent,
    CrearUsuarioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    BrowserAnimationsModule, 
    MatCardModule,  
    MatFormFieldModule,  
    MatInputModule,  
    MatButtonModule,  
    MatIconModule,  
    FormsModule,  
    ReactiveFormsModule,  
    HttpClientModule,  // Para las peticiones HTTP (ej: login)
    MatSnackBarModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
