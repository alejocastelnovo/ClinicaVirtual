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
            
            if (usuario.id_cobertura) {
              this.turnoForm.patchValue({
                cobertura: usuario.id_cobertura
              });
            } else {
              this.mostrarError('El usuario no tiene una cobertura asignada');
            }
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
    
    // Convertir la fecha a string en formato YYYY-MM-DD para comparar
    const dateStr = this.formatearFecha(date);
    
    // Verificar si la fecha está en las fechas disponibles
    return this.fechasDisponibles.some(disponible => 
      this.formatearFecha(disponible) === dateStr
    );
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
            // Convertir las fechas de string a objetos Date
            this.fechasDisponibles = [...new Set(
              this.agendasDisponibles.map(agenda => new Date(agenda.fecha))
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

  generarHorariosDisponibles() {
    if (this.agendaSeleccionada) {
      const horaInicio = parseInt(this.agendaSeleccionada.hora_entrada.split(':')[0], 10);
      const horaFin = parseInt(this.agendaSeleccionada.hora_salida.split(':')[0], 10);
      const minutosDisponibles = ['00', '30']; // Intervalos de 30 minutos

      this.horariosDisponibles = [];
      for (let hora = horaInicio; hora < horaFin; hora++) {
        const horaStr = hora.toString().padStart(2, '0');
        minutosDisponibles.forEach(minutos => {
          this.horariosDisponibles.push(`${horaStr}:${minutos}`);
        });
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
      const usuario = this.authService.getCurrentUser();
      const agendaId = this.turnoForm.get('agenda')?.value;
      const agendaSeleccionada = this.agendasDisponibles.find(agenda => agenda.id === agendaId);

      if (!usuario || !agendaSeleccionada) {
        this.mostrarError('Error: Datos incompletos');
        return;
      }

      // Obtener la cobertura del formulario o del usuario
      const idCobertura = this.turnoForm.get('cobertura')?.value || usuario.id_cobertura;
      
      if (!idCobertura) {
        this.mostrarError('Error: No se ha podido determinar la cobertura del paciente');
        return;
      }

      const turnoData = {
        id_agenda: agendaId,
        id_paciente: usuario.id,
        id_cobertura: idCobertura,
        fecha: this.formatearFecha(this.turnoForm.get('fecha')?.value),
        hora: `${this.turnoForm.get('hora')?.value}:00`,
        nota: this.turnoForm.get('nota')?.value || ''
      };

      // Verificar que todos los campos requeridos estén presentes
      if (!turnoData.id_agenda || !turnoData.id_paciente || !turnoData.fecha || !turnoData.hora) {
        this.mostrarError('Por favor, complete todos los campos requeridos');
        return;
      }

      this.loading = true;
      
      this.turnoService.asignarTurno(turnoData).subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.codigo === 200) {
            this.snackBar.open('Turno asignado correctamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/paciente/mis-turnos']);
          } else {
            this.mostrarError(response.mensaje || 'Error al asignar el turno');
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error detallado:', error);
          this.mostrarError('Error al asignar el turno');
        }
      });
    } else {
      this.mostrarError('Por favor, complete todos los campos requeridos');
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
      const hora = turno.hora; // Ahora usamos la hora completa como clave
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
    this.especialidadService.obtenerCoberturas().subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.coberturas = response.payload;
          // Obtener el usuario actual y su cobertura
          const user = this.authService.getCurrentUser();
          if (user?.id_cobertura) {
            const coberturaUsuario = this.coberturas.find(
              cobertura => cobertura.id === user.id_cobertura
            );
            if (coberturaUsuario) {
              this.turnoForm.patchValue({
                cobertura: coberturaUsuario.id
              });
            }
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
  this.agendasFiltradas = this.agendasDisponibles.filter(agenda => 
    this.formatearFecha(new Date(agenda.fecha)) === fechaStr
  );

  if (this.agendasFiltradas.length === 0) {
    this.turnoForm.get('agenda')?.reset();
    this.mostrarError('No hay agendas disponibles para la fecha seleccionada');
  }
}
}
