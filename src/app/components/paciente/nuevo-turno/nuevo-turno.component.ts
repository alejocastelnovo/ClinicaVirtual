import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TurnoService } from '../../../services/turno.service';
import { EspecialidadService } from '../../../services/especialidad.service';
import { AgendaService } from '../../../services/agenda.service';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.component.html',
  styleUrls: ['./nuevo-turno.component.css']
})
export class NuevoTurnoComponent implements OnInit {
  turnoForm: FormGroup = this.fb.group({
    cobertura: ['', Validators.required],
    especialidad: ['', Validators.required],
    profesional: ['', Validators.required],
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    nota: ['', [Validators.required, Validators.minLength(10)]]
  });

  coberturas: any[] = [];
  especialidades: any[] = [];
  medicos: any[] = [];
  horariosDisponibles: string[] = [];
  loading = false;
  agendaSeleccionada: any = null;

  constructor(
    private fb: FormBuilder,
    private turnoService: TurnoService,
    private especialidadService: EspecialidadService,
    private agendaService: AgendaService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    this.loading = true;

    this.especialidadService.obtenerEspecialidades()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          console.log('Respuesta especialidades:', response);
          if (response.codigo === 200) {
            this.especialidades = response.payload;
          } else {
            this.mostrarError(response.mensaje || 'Error al cargar especialidades');
          }
        },
        error: (error) => {
          console.error('Error al cargar especialidades:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.mostrarError('Error al cargar especialidades. Por favor, intente nuevamente.');
          }
        }
      });

    this.especialidadService.obtenerCoberturas()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          console.log('Respuesta coberturas:', response);
          if (response.codigo === 200) {
            this.coberturas = response.payload;
          } else {
            this.mostrarError(response.mensaje || 'Error al cargar coberturas');
          }
        },
        error: (error) => {
          console.error('Error al cargar coberturas:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.mostrarError('Error al cargar coberturas. Por favor, intente nuevamente.');
          }
        }
      });
  }

  onEspecialidadChange() {
    const especialidadId = this.turnoForm.get('especialidad')?.value;
    if (especialidadId) {
      this.loading = true;
      this.especialidadService.obtenerMedicoPorEspecialidad(especialidadId).subscribe({
        next: (response) => {
          if (response.codigo === 200) {
            this.medicos = response.payload;
          }
        },
        error: (error) => this.mostrarError('Error al cargar médicos'),
        complete: () => this.loading = false
      });
    }
  }

  onMedicoChange() {
    const medicoId = this.turnoForm.get('profesional')?.value;
    if (medicoId) {
      this.loading = true;
      this.agendaService.obtenerAgenda(medicoId).subscribe({
        next: (response) => {
          if (response.codigo === 200 && response.payload.length > 0) {
            this.agendaSeleccionada = response.payload[0];
            this.generarHorariosDisponibles();
          }
        },
        error: (error) => this.mostrarError('Error al cargar agenda del médico'),
        complete: () => this.loading = false
      });
    }
  }

  generarHorariosDisponibles() {
    if (this.agendaSeleccionada) {
      const horaInicio = parseInt(this.agendaSeleccionada.hora_entrada.split(':')[0]);
      const horaFin = parseInt(this.agendaSeleccionada.hora_salida.split(':')[0]);
      
      this.horariosDisponibles = [];
      for (let hora = horaInicio; hora < horaFin; hora++) {
        this.horariosDisponibles.push(`${hora.toString().padStart(2, '0')}:00`);
        this.horariosDisponibles.push(`${hora.toString().padStart(2, '0')}:30`);
      }
    }
  }

  onSubmit() {
    if (this.turnoForm.valid) {
      this.loading = true;
      
      const turnoData = {
        id_agenda: this.agendaSeleccionada.id,
        id_paciente: 1, // Esto debería venir del usuario logueado
        id_cobertura: this.turnoForm.value.cobertura,
        fecha: this.formatearFecha(this.turnoForm.value.fecha),
        hora: this.turnoForm.value.hora,
        nota: this.turnoForm.value.nota
      };

      this.turnoService.asignarTurno(turnoData).subscribe({
        next: (response) => {
          if (response.codigo === 200) {
            this.snackBar.open('Turno asignado correctamente', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/paciente/mis-turnos']);
          } else {
            this.mostrarError(response.mensaje);
          }
        },
        error: (error) => this.mostrarError('Error al asignar el turno'),
        complete: () => this.loading = false
      });
    }
  }

  private formatearFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000
    });
  }
}
