import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EspecialidadService } from '../../../services/especialidad.service';
import { TurnoService } from '../../../services/turno.service';
import { AgendaService } from '../../../services/agenda.service';
import { AuthService } from '../../../services/auth.service';
import { OperadorService } from '../../../services/operador.service';

@Component({
  selector: 'app-asignar-turno',
  templateUrl: './asignar-turno.component.html',
  styleUrls: ['./asignar-turno.component.css']
})
export class AsignarTurnoComponent implements OnInit {
  turnoForm!: FormGroup;
  especialidades: any[] = [];
  medicos: any[] = [];
  pacientes: any[] = [];
  coberturas: any[] = [];
  horariosDisponibles: string[] = [];
  minutosDisponibles: string[] = ['00', '30'];
  loading = false;
  agendaSeleccionada: any;
  minDate = new Date();
  fechasDisponibles: Date[] = [];
  agendasDisponibles: any[] = [];
  agendasFiltradas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private especialidadService: EspecialidadService,
    private turnoService: TurnoService,
    private agendaService: AgendaService,
    private operadorService: OperadorService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();

    // Suscripciones a cambios en el formulario
    this.turnoForm.get('paciente')?.valueChanges.subscribe(pacienteId => {
      if (pacienteId) {
        const paciente = this.pacientes.find(p => p.id_usuario === pacienteId);
        if (paciente?.id_cobertura) {
          this.turnoForm.patchValue({
            cobertura: paciente.id_cobertura
          }, { emitEvent: false });
        }
      }
    });

    this.turnoForm.get('especialidad')?.valueChanges.subscribe(value => {
      if (value) {
        this.medicos = [];
        this.turnoForm.get('profesional')?.reset();
        this.cargarMedicosPorEspecialidad(value);
      }
    });

    this.turnoForm.get('profesional')?.valueChanges.subscribe(value => {
      if (value) {
        this.cargarAgendaMedico(value);
      }
    });

    this.turnoForm.get('fecha')?.valueChanges.subscribe(fecha => {
      if (fecha) {
        this.filtrarAgendasPorFecha(fecha);
      }
    });

    this.turnoForm.get('agenda')?.valueChanges.subscribe(agendaId => {
      if (agendaId) {
        this.agendaSeleccionada = this.agendasDisponibles.find(a => a.id === agendaId);
        this.generarHorariosDisponibles();
      }
    });
  }

  private initForm() {
    this.turnoForm = this.fb.group({
      paciente: ['', Validators.required],
      cobertura: [{value: '', disabled: true}],
      especialidad: ['', Validators.required],
      profesional: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      minutos: ['', Validators.required],
      nota: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  cargarDatosIniciales() {
    // Cargar pacientes
    this.operadorService.obtenerPacientes().subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.pacientes = response.payload.filter((u: any) => u.rol === 'paciente');
          console.log('Pacientes cargados:', this.pacientes);
        }
      },
      error: () => this.mostrarError('Error al cargar pacientes')
    });

    // Cargar especialidades
    this.especialidadService.obtenerEspecialidades().subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.especialidades = response.payload;
          console.log('Especialidades cargadas:', this.especialidades);
        }
      },
      error: () => this.mostrarError('Error al cargar especialidades')
    });
  }

  dateFilter = (d: Date | null): boolean => {
    if (!d) return false;
    return this.fechasDisponibles.some(fecha => 
      fecha.getDate() === d.getDate() &&
      fecha.getMonth() === d.getMonth() &&
      fecha.getFullYear() === d.getFullYear()
    );
  };

  cargarAgendaMedico(medicoId: number) {
    if (!medicoId) return;
    
    this.loading = true;
    this.agendaService.obtenerAgenda(medicoId).subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          if (response.payload && response.payload.length > 0) {
            this.agendasDisponibles = response.payload;
            this.fechasDisponibles = [...new Set(
              this.agendasDisponibles.map(agenda => new Date(agenda.fecha))
            )];
          } else {
            this.agendasDisponibles = [];
            this.fechasDisponibles = [];
            this.mostrarError('No hay agendas disponibles para este médico');
          }
        }
      },
      error: (error) => this.mostrarError('Error al cargar agenda'),
      complete: () => this.loading = false
    });
  }

  filtrarAgendasPorFecha(fecha: Date) {
    const fechaFormateada = this.formatearFecha(fecha);
    this.agendasFiltradas = this.agendasDisponibles.filter(
      agenda => agenda.fecha === fechaFormateada
    );
    
    if (this.agendasFiltradas.length > 0) {
      this.agendaSeleccionada = this.agendasFiltradas[0];
      this.generarHorariosDisponibles();
    }
  }

  onCancel() {
    this.router.navigate(['/operador/dashboard']);
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
      const pacienteSeleccionado = this.pacientes.find(p => p.id === this.turnoForm.value.paciente);
      
      const turnoData = {
        id_agenda: this.agendaSeleccionada.id,
        id_paciente: this.turnoForm.value.paciente,
        id_cobertura: pacienteSeleccionado?.id_cobertura,
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

  cargarMedicosPorEspecialidad(especialidadId: number) {
    this.loading = true;
    this.especialidadService.obtenerMedicoPorEspecialidad(especialidadId).subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.medicos = response.payload;
        } else {
          this.mostrarError('No hay médicos disponibles para esta especialidad');
        }
      },
      error: () => this.mostrarError('Error al cargar médicos'),
      complete: () => this.loading = false
    });
  }
}
