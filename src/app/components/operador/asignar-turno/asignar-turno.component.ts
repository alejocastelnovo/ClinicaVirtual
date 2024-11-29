import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EspecialidadService } from '../../../services/especialidad.service';
import { TurnoService } from '../../../services/turno.service';
import { AgendaService } from '../../../services/agenda.service';
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
  fechasDisponibles: string[] = [];
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
    this.cargarCoberturas();

    // Suscripciones a cambios en el formulario
    this.turnoForm.get('paciente')?.valueChanges.subscribe(pacienteId => {
      if (pacienteId) {
        // Obtener los datos completos del usuario seleccionado
        this.operadorService.obtenerUsuario(pacienteId).subscribe({
          next: (response: any) => {
            if (response.codigo === 200 && response.payload) {
              const usuario = Array.isArray(response.payload) ? response.payload[0] : response.payload;
              if (usuario.id_cobertura) {
                this.turnoForm.patchValue({
                  cobertura: usuario.id_cobertura
                }, { emitEvent: false });
                console.log('Cobertura actualizada:', usuario.id_cobertura);
              } else {
                this.mostrarError('El paciente no tiene una cobertura asignada');
                this.turnoForm.patchValue({ cobertura: '' }, { emitEvent: false });
              }
            } else {
              this.mostrarError('No se pudo obtener los datos del paciente');
            }
          },
          error: (error) => {
            console.error('Error al cargar datos del usuario:', error);
            this.mostrarError('Error al cargar los datos del paciente');
          }
        });
      } else {
        // Limpiar cobertura si no hay paciente seleccionado
        this.turnoForm.patchValue({ cobertura: '' }, { emitEvent: false });
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
      paciente: [null, Validators.required],
      cobertura: ['', Validators.required],
      especialidad: ['', Validators.required],
      profesional: ['', Validators.required],
      fecha: ['', Validators.required],
      agenda: ['', Validators.required],
      hora: ['', Validators.required],
      nota: ['', [Validators.required, Validators.minLength(2)]]
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

  cargarAgendaMedico(medicoId: number) {
    if (!medicoId) {
      this.mostrarError('ID de médico no válido');
      return;
    }

    this.loading = true;
    console.log('Cargando agenda para médico ID:', medicoId);
    
    this.agendaService.obtenerAgenda(medicoId).subscribe({
      next: (response: any) => {
        console.log('Respuesta agenda:', response);
        if (response.codigo === 200) {
          if (response.payload && response.payload.length > 0) {
            this.agendasDisponibles = response.payload;
            // Convertir las fechas de string a objetos Date y formatear
            this.fechasDisponibles = [...new Set(
              this.agendasDisponibles.map(agenda => this.formatearFecha(new Date(agenda.fecha)))
            )];
            
            // Si hay una fecha seleccionada, filtrar las agendas
            const fechaSeleccionada = this.turnoForm.get('fecha')?.value;
            if (fechaSeleccionada) {
              this.filtrarAgendasPorFecha(fechaSeleccionada);
            }
          } else {
            this.agendasDisponibles = [];
            this.fechasDisponibles = [];
            this.mostrarError('No hay agendas disponibles para este médico');
          }
        } else {
          this.mostrarError(response.mensaje || 'Error al obtener las agendas');
        }
      },
      error: (error) => {
        console.error('Error al cargar agenda:', error);
        this.mostrarError('Error al cargar agenda del médico');
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }

  filtrarAgendasPorFecha(fecha: string) {
    const fechaStr = this.formatearFecha(new Date(fecha));
    console.log('Filtrando agendas para fecha:', fechaStr);
    
    this.agendasFiltradas = this.agendasDisponibles.filter(agenda => {
      const agendaFecha = this.formatearFecha(new Date(agenda.fecha));
      console.log(`Comparando agenda fecha: ${agendaFecha} con fecha seleccionada: ${fechaStr}`);
      return agendaFecha === fechaStr;
    });

    console.log('Agendas filtradas:', this.agendasFiltradas);

    if (this.agendasFiltradas.length === 0) {
      this.turnoForm.get('agenda')?.reset();
      this.mostrarError('No hay agendas disponibles para la fecha seleccionada');
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
      const turnoData = {
        id_agenda: this.turnoForm.get('agenda')?.value,
        id_paciente: this.turnoForm.get('paciente')?.value,
        id_cobertura: this.turnoForm.get('cobertura')?.value,
        fecha: this.formatearFecha(this.turnoForm.get('fecha')?.value),
        hora: this.turnoForm.get('hora')?.value,
        nota: this.turnoForm.get('nota')?.value
      };

      console.log('Datos del turno a enviar:', turnoData);

      this.loading = true;
      this.turnoService.asignarTurno(turnoData).subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.codigo === 200) {
            this.mostrarExito('Turno asignado correctamente');
            this.router.navigate(['/operador/lista-medicos']);
          } else {
            this.mostrarError(response.mensaje || 'Error al asignar el turno');
          }
        },
        error: (error) => {
          console.error('Error al asignar turno:', error);
          this.mostrarError('Error al asignar el turno');
          this.loading = false;
        }
      });
    } else {
      this.mostrarError('Por favor, complete todos los campos requeridos');
    }
  }

  mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  mostrarExito(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const formattedDate = this.formatearFecha(date);
    return this.fechasDisponibles.includes(formattedDate);
  };

  onCancel() {
    this.router.navigate(['/operador/dashboard']);
  }

  cargarCoberturas() {
    this.especialidadService.obtenerCoberturas().subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.coberturas = response.payload;
        }
      },
      error: (error) => {
        this.mostrarError('Error al cargar las coberturas');
      }
    });
  }
}
