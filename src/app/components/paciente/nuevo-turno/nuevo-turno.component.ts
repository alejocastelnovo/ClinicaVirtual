import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { TurnoService } from 'src/app/services/turno.service';
import { AgendaService } from 'src/app/services/agenda.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.component.html',
  styleUrls: ['./nuevo-turno.component.css']
})
export class NuevoTurnoComponent implements OnInit {
  turnoForm!: FormGroup;
  especialidades: any[] = [];
  medicos: any[] = [];
  horariosDisponibles: string[] = [];
  loading = false;
  agendaSeleccionada: any;
  minDate = new Date();
  fechasDisponibles: Date[] = [];
  turnos: any[] = [];
  coberturas: any[] = [];
  agendasDisponibles: any[] = [];
  agendasFiltradas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private especialidadService: EspecialidadService,
    private turnoService: TurnoService,
    private agendaService: AgendaService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.initForm();
    this.cargarDatosUsuario();
    this.cargarCoberturas();
  }

  private initForm() {
    this.turnoForm = this.fb.group({
      cobertura: [{value: '', disabled: true}],
      especialidad: ['', Validators.required],
      profesional: ['', Validators.required],
      fecha: ['', Validators.required],
      agenda: ['', Validators.required],
      hora: ['', [Validators.required, Validators.pattern('^(09|1[0-7]):[0-5][0-9]$')]],
      nota: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  cargarDatosUsuario() {
    const userId = this.authService.getCurrentUser()?.id;
    if (userId) {
      this.authService.obtenerUsuario(userId).subscribe({
        next: (response: any) => {
          if (response.codigo === 200 && response.payload) {
            const usuario = Array.isArray(response.payload) ? 
                           response.payload[0] : response.payload;
            
            // Buscamos la cobertura correspondiente
            this.especialidadService.obtenerCoberturas().subscribe({
              next: (coberturaResponse: any) => {
                if (coberturaResponse.codigo === 200) {
                  const cobertura = coberturaResponse.payload.find(
                    (c: any) => c.id === usuario.id_cobertura
                  );
                  if (cobertura) {
                    this.turnoForm.patchValue({
                      cobertura: cobertura.nombre
                    });
                  }
                }
              }
            });
          }
        },
        error: (error) => {
          console.error('Error al cargar datos del usuario:', error);
          this.mostrarError('Error al cargar los datos del usuario');
        }
      });
    }
  }

  ngOnInit(): void {
    this.cargarEspecialidades();

    // Suscripciones a cambios en el formulario
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

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    
    // No permitir fines de semana
    const day = date.getDay();
    if (day === 0 || day === 6) return false;
    
    // Verificar si la fecha está en las fechas disponibles
    const fechaStr = date.toDateString();
    return this.fechasDisponibles.some((f: Date) => f.toDateString() === fechaStr);
  };

  verificarTurnosExistentes(fecha: Date) {
    const fechaStr = this.formatearFecha(fecha);
    const medicoId = this.turnoForm.get('profesional')?.value;

    this.turnoService.obtenerTurnosMedico(medicoId, fechaStr).subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.turnos = response.payload;
          this.actualizarHorariosDisponibles();
        }
      },
      error: () => this.mostrarError('Error al verificar turnos existentes')
    });
  }

  cargarEspecialidades() {
    this.loading = true;
    console.log('Iniciando carga de especialidades...');
    
    this.especialidadService.obtenerEspecialidades().subscribe({
      next: (response: any) => {
        console.log('Respuesta completa:', response);
        if (response && response.codigo === 200) {
          this.especialidades = response.payload;
          console.log('Especialidades cargadas:', this.especialidades);
        } else {
          this.mostrarError('No se pudieron cargar las especialidades');
          console.error('Respuesta inesperada:', response);
        }
      },
      error: (error) => {
        console.error('Error al cargar especialidades:', error);
        this.mostrarError('Error al cargar especialidades');
      },
      complete: () => {
        this.loading = false;
        console.log('Carga de especialidades completada');
      }
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
    this.loading = true;
    this.agendaService.obtenerAgenda(medicoId).subscribe({
      next: (response: any) => {
        if (response.codigo === 200 && response.payload.length > 0) {
          this.agendasDisponibles = response.payload;
          this.fechasDisponibles = [...new Set(
            this.agendasDisponibles.map(agenda => new Date(agenda.fecha))
          )];
        } else {
          this.agendasDisponibles = [];
          this.fechasDisponibles = [];
          this.mostrarError('No hay agendas disponibles para este médico');
        }
      },
      error: () => this.mostrarError('Error al cargar agenda del médico'),
      complete: () => this.loading = false
    });
  }

  generarHorariosDisponibles() {
    if (this.agendaSeleccionada) {
      const horaInicio = parseInt(this.agendaSeleccionada.hora_entrada.split(':')[0], 10);
      const horaFin = parseInt(this.agendaSeleccionada.hora_salida.split(':')[0], 10);

      this.horariosDisponibles = [];
      for (let hora = horaInicio; hora < horaFin; hora++) {
        this.horariosDisponibles.push(`${hora.toString().padStart(2, '0')}`);
      }
    }
  }

  mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  onSubmit() {
    if (this.turnoForm.valid) {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user?.id) {
        this.mostrarError('Error: No se pudo obtener la información del usuario');
        return;
      }

      const turnoData = {
        id_agenda: this.turnoForm.get('agenda')?.value,
        id_paciente: user.id,
        id_cobertura: user.id_cobertura,
        fecha: this.formatearFecha(this.turnoForm.value.fecha),
        hora: this.turnoForm.value.hora,
        nota: this.turnoForm.value.nota
      };

      this.loading = true;
      this.turnoService.asignarTurno(turnoData).subscribe({
        next: (response: any) => {
          if (response.codigo === 200) {
            this.snackBar.open('Turno asignado correctamente', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/paciente/mis-turnos']);
          }
        },
        error: (error) => {
          this.mostrarError('Error al asignar el turno');
          console.error('Error detallado:', error);
        },
        complete: () => this.loading = false
      });
    }
  }

  formatearFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }

  cancelar() {
    this.router.navigate(['/dashboard']);
  }

  actualizarHorariosDisponibles() {
    if (!this.agendaSeleccionada || !this.turnos) return;

    // Filtrar las horas que ya tienen dos turnos asignados
    const horasOcupadas = this.turnos.reduce((acc: { [key: string]: number }, turno: any) => {
      const hora = turno.hora.split(':')[0];
      acc[hora] = (acc[hora] || 0) + 1;
      return acc;
    }, {});

    this.horariosDisponibles = this.horariosDisponibles.filter(hora => {
      return !horasOcupadas[hora] || horasOcupadas[hora] < 2;
    });

    // Si la hora seleccionada ya no está disponible, resetear el campo
    const horaSeleccionada = this.turnoForm.get('hora')?.value;
    if (horaSeleccionada && !this.horariosDisponibles.includes(horaSeleccionada)) {
      this.turnoForm.patchValue({ hora: '' });
      this.mostrarError('La hora seleccionada ya no está disponible');
    }
  }

  cargarCoberturas() {
    this.especialidadService.obtenerCobertura().subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.coberturas = response.payload;
          // Establecer la cobertura del usuario actual
          const user = this.authService.getCurrentUser();
          if (user?.id_cobertura) {
            this.turnoForm.patchValue({
              cobertura: user.id_cobertura
            });
          }
        }
      },
      error: (error) => {
        this.mostrarError('Error al cargar las coberturas');
      }
    });
  }

  filtrarAgendasPorFecha(fecha: Date) {
    const fechaStr = this.formatearFecha(fecha);
    this.agendasFiltradas = this.agendasDisponibles.filter(
      agenda => agenda.fecha === fechaStr
    );
    
    if (this.agendasFiltradas.length === 0) {
      this.turnoForm.get('agenda')?.reset();
      this.mostrarError('No hay agendas disponibles para la fecha seleccionada');
    }
  }
}
