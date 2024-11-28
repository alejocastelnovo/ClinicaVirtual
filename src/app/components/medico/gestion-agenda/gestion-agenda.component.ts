import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AgendaService } from '../../../services/agenda.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

interface Agenda {
  id: number;
  id_medico: number;
  id_especialidad: number;
  fecha: string;
  hora_entrada: string;
  hora_salida: string;
}

interface RangoHorario {
  hora_entrada: string;
  hora_salida: string;
}

interface ResponseData {
  codigo: number;
  mensaje: string;
  payload: any;
}

@Component({
  selector: 'app-gestion-agenda',
  templateUrl: './gestion-agenda.component.html',
  styleUrls: ['./gestion-agenda.component.css']
})
export class GestionAgendaComponent implements OnInit {
  agendaForm: FormGroup;
  loading = false;
  agendaActual: Agenda | null = null;
  horas = Array.from({length: 13}, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);
  diasSemana: any;
  fechaSeleccionada = new FormControl(new Date());
  rangosHorarios: RangoHorario[] = [];

  constructor(
    private fb: FormBuilder,
    private agendaService: AgendaService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.agendaForm = this.fb.group({
      hora_entrada: ['', Validators.required],
      hora_salida: ['', Validators.required]
    }, { validator: this.horariosValidos });
  }

  ngOnInit() {
    this.cargarAgenda();
    this.cargarEspecialidadMedico();
  }

  private cargarEspecialidadMedico() {
    const usuario = this.authService.getCurrentUser();
    if (usuario && usuario.id) {
      this.authService.obtenerEspecialidadMedico(usuario.id).subscribe({
        next: (response) => {
          if (response.codigo === 200 && response.payload.length > 0) {
            const usuarioActualizado = {
              ...usuario,
              id_especialidad: response.payload[0].id_especialidad
            };
            localStorage.setItem('user', JSON.stringify(usuarioActualizado));
          } else {
            this.mostrarError('No se encontraron especialidades asignadas al médico');
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.mostrarError('Error al obtener la especialidad del médico');
        }
      });
    }
  }

  cargarAgenda() {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.agendaService.obtenerAgenda(usuario.id).subscribe({
      next: (response) => {
        if (response.codigo === 200 && response.payload.length > 0) {
          this.agendaActual = response.payload[0];
          if (this.agendaActual) {
            this.agendaForm.patchValue({
              fecha: this.agendaActual.fecha,
              hora_entrada: this.agendaActual.hora_entrada,
              hora_salida: this.agendaActual.hora_salida
            });
          }
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.mostrarError('Error al cargar la agenda');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onFechaChange() {
    const fecha = this.formatearFecha(this.fechaSeleccionada.value!);
    this.cargarAgendaPorFecha(fecha);
  }
  
  cargarAgendaPorFecha(fecha: string) {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }
  
    this.loading = true;
    this.agendaService.obtenerAgenda(usuario.id).subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.rangosHorarios = response.payload
            .filter((agenda: Agenda) => agenda.fecha === fecha)
            .map((agenda: Agenda) => ({
              hora_entrada: agenda.hora_entrada,
              hora_salida: agenda.hora_salida
            }));
        } else {
          this.rangosHorarios = [];
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.mostrarError('Error al cargar la agenda');
        this.rangosHorarios = [];
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  
  agregarRangoHorario() {
    if (this.agendaForm.valid && this.fechaSeleccionada.value) {
      const usuario = this.authService.getCurrentUser();
      
      if (!usuario || !usuario.id) {
        this.mostrarError('Error: Información de usuario incompleta');
        this.router.navigate(['/login']);
        return;
      }

      const agenda = {
        id_medico: usuario.id,
        id_especialidad: 1,
        fecha: this.formatearFecha(this.fechaSeleccionada.value),
        hora_entrada: this.agendaForm.value.hora_entrada,
        hora_salida: this.agendaForm.value.hora_salida
      };

      this.loading = true;
      this.agendaService.crearAgenda(agenda).subscribe({
        next: (response) => {
          if (response && response.codigo === 200) {
            this.mostrarMensaje('Horario agregado correctamente');
            this.cargarAgendaPorFecha(agenda.fecha);
            this.agendaForm.reset();
          } else {
            this.mostrarError(response?.mensaje || 'Error al guardar el horario');
          }
        },
        error: (error) => {
          console.error('Error completo:', error);
          this.mostrarError('Error al guardar la agenda');
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.mostrarError('Por favor, complete todos los campos requeridos');
    }
  }
  
  private formatearFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }

  eliminarRango(rango: RangoHorario) {
    if (this.agendaActual) {
      this.loading = true;
      this.agendaService.modificarAgenda(this.agendaActual.id, {
        ...this.agendaActual,
        hora_entrada: '',
        hora_salida: ''
      }).subscribe({
        next: (response) => {
          if (response.codigo === 200) {
            this.mostrarMensaje('Horario eliminado correctamente');
            const fecha = this.formatearFecha(this.fechaSeleccionada.value!);
            this.cargarAgendaPorFecha(fecha);
          } else {
            this.mostrarError(response.mensaje);
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.mostrarError('Error al eliminar el horario');
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  guardarAgenda() {
    if (this.agendaForm.valid) {
      const usuario = this.authService.getCurrentUser();
      const agenda = {
        ...this.agendaForm.value,
        id_medico: usuario.id,
        id_especialidad: usuario.id_especialidad,
/*         fecha: this.formatearFecha(this.agendaForm.value.fecha),
 */        hora_entrada: this.agendaForm.value.hora_entrada,
        hora_salida: this.agendaForm.value.hora_salida
      };

      this.loading = true;
      const operacion = this.agendaActual 
        ? this.agendaService.modificarAgenda(this.agendaActual.id, agenda)
        : this.agendaService.crearAgenda(agenda);

      operacion.subscribe({
        next: (response) => {
          if (response.codigo === 200) {
            this.mostrarMensaje(response.mensaje);
            this.cargarAgenda();
          } else {
            this.mostrarError(response.mensaje);
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.mostrarError('Error al guardar la agenda');
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  private horariosValidos(group: FormGroup) {
    const entrada = group.get('hora_entrada')?.value;
    const salida = group.get('hora_salida')?.value;
    
    if (entrada && salida) {
      const horaEntrada = parseInt(entrada.split(':')[0]);
      const horaSalida = parseInt(salida.split(':')[0]);
      
      if (horaSalida <= horaEntrada) {
        return { horariosInvalidos: true };
      }
    }
    return null;
  }

  private mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000
    });
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  actualizarAgenda() {
    if (this.agendaForm.valid && this.agendaActual) {
      this.agendaService.modificarAgenda(this.agendaActual.id, {
        hora_entrada: this.agendaForm.value.hora_entrada,
        hora_salida: this.agendaForm.value.hora_salida
      }).subscribe({
        next: (response: ResponseData) => {
          if (response.codigo === 200) {
            this.mostrarMensaje('Agenda actualizada correctamente');
            this.cargarAgenda();
          } else {
            this.mostrarError(response.mensaje);
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
          this.mostrarError('Error al actualizar la agenda');
        }
      });
    }
  }
}


