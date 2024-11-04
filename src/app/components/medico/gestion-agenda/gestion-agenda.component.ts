import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private agendaService: AgendaService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.agendaForm = this.fb.group({
      fecha: ['', Validators.required],
      hora_entrada: ['', Validators.required],
      hora_salida: ['', Validators.required]
    }, { validator: this.horariosValidos });
  }

  ngOnInit() {
    this.cargarAgenda();
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

  guardarAgenda() {
    if (this.agendaForm.valid) {
      const usuario = this.authService.getCurrentUser();
      const agenda = {
        ...this.agendaForm.value,
        id_medico: usuario.id,
        id_especialidad: usuario.id_especialidad
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
}
