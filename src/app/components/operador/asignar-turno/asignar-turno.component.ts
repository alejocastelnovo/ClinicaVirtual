import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EspecialidadService } from '../../../services/especialidad.service';
import { TurnoService } from '../../../services/turno.service';
import { AgendaService } from '../../../services/agenda.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-asignar-turno',
  templateUrl: './asignar-turno.component.html',
  styleUrls: ['./asignar-turno.component.css']
})
export class AsignarTurnoComponent implements OnInit {
onCancelar() {
throw new Error('Method not implemented.');
}
  turnoForm: FormGroup;
  especialidades: any[] = [];
  medicos: any[] = [];
  pacientes: any[] = [];
  coberturas: any[] = [];
  horariosDisponibles: string[] = [];
  minutosDisponibles: string[] = ['00', '30'];
  loading = false;
  agendaSeleccionada: any;
  turnos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private especialidadService: EspecialidadService,
    private turnoService: TurnoService,
    private agendaService: AgendaService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.turnoForm = this.fb.group({
      paciente: ['', Validators.required],
      cobertura: ['', Validators.required],
      especialidad: ['', Validators.required],
      profesional: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      minutos: ['', Validators.required],
      nota: ['', [Validators.required, Validators.minLength(10)]]
    });

    // Habilitar/deshabilitar campos según selección
    this.turnoForm.get('paciente')?.valueChanges.subscribe(value => {
      if (value) {
        this.turnoForm.get('cobertura')?.enable();
      } else {
        this.turnoForm.get('cobertura')?.disable();
      }
    });

    this.turnoForm.get('especialidad')?.valueChanges.subscribe(value => {
      if (value) {
        this.cargarMedicosPorEspecialidad(value);
      }
    });

    this.turnoForm.get('profesional')?.valueChanges.subscribe(value => {
      if (value) {
        this.cargarAgendaMedico(value);
      }
    });

    this.turnoForm.get('fecha')?.valueChanges.subscribe(value => {
      if (value) {
        this.generarHorariosDisponibles();
      }
    });
  }

  ngOnInit() {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    this.loading = true;
    
    // Cargar especialidades
    this.especialidadService.obtenerEspecialidades().subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.especialidades = response.payload;
        }
      },
      error: (error) => this.mostrarError('Error al cargar especialidades')
    });

    // Cargar pacientes
    this.authService.obtenerUsuario(0).subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.pacientes = response.payload.filter((user: any) => user.rol === 'paciente');
        }
      },
      error: (error) => this.mostrarError('Error al cargar pacientes')
    });

    // Cargar coberturas
    this.especialidadService.obtenerCoberturas().subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.coberturas = response.payload;
        }
      },
      error: (error) => this.mostrarError('Error al cargar coberturas')
    });
  }

  cargarMedicosPorEspecialidad(especialidadId: number) {
    this.loading = true;
    this.especialidadService.obtenerMedicoPorEspecialidad(especialidadId).subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.medicos = response.payload;
        }
      },
      error: (error) => this.mostrarError('Error al cargar médicos'),
      complete: () => this.loading = false
    });
  }

  cargarAgendaMedico(medicoId: number) {
    this.loading = true;
    this.agendaService.obtenerAgenda(medicoId).subscribe({
      next: (response: any) => {
        if (response.codigo === 200 && response.payload.length > 0) {
          this.agendaSeleccionada = response.payload[0];
          this.generarHorariosDisponibles();
        }
      },
      error: (error) => this.mostrarError('Error al cargar agenda'),
      complete: () => this.loading = false
    });
  }

  generarHorariosDisponibles() {
    if (this.agendaSeleccionada) {
      const horaInicio = parseInt(this.agendaSeleccionada.hora_entrada.split(':')[0]);
      const horaFin = parseInt(this.agendaSeleccionada.hora_salida.split(':')[0]);
      
      this.horariosDisponibles = [];
      for (let hora = horaInicio; hora < horaFin; hora++) {
        this.horariosDisponibles.push(`${hora.toString().padStart(2, '0')}`);
      }
    }
  }

  onSubmit() {
    if (this.turnoForm.valid) {
      const turnoData = {
        id_agenda: this.agendaSeleccionada.id,
        id_paciente: this.turnoForm.value.paciente,
        id_cobertura: this.turnoForm.value.cobertura,
        fecha: this.formatearFecha(this.turnoForm.value.fecha),
        hora: `${this.turnoForm.value.hora}:${this.turnoForm.value.minutos}`,
        nota: this.turnoForm.value.nota
      };

      this.turnoService.asignarTurno(turnoData).subscribe({
        next: (response: any) => {
          if (response.codigo === 200) {
            this.mostrarExito('Turno asignado correctamente');
            this.router.navigate(['/operador/dashboard']);
          }
        },
        error: (error) => this.mostrarError('Error al asignar el turno')
      });
    }
  }

  private formatearFecha(fecha: Date): string {
    return `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
  }

  mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  mostrarExito(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
