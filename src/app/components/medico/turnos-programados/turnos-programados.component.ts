import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../../services/turno.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

interface Turno {
  id_turno: number;
  fecha: string;
  hora: string;
  nombre_paciente: string;
  fecha_nacimiento: string;
  cobertura: string;
  nota: string;
}

@Component({
  selector: 'app-turnos-programados',
  templateUrl: './turnos-programados.component.html',
  styleUrls: ['./turnos-programados.component.css']
})
export class TurnosProgramadosComponent implements OnInit {
  turnos: Turno[] = [];
  loading = false;
  fechaSeleccionada = new FormControl(new Date());

  constructor(
    private turnoService: TurnoService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarTurnos();
  }

  cargarTurnos() {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    const fecha = this.formatearFechaParaAPI(this.fechaSeleccionada.value!);

    this.turnoService.obtenerTurnosMedico(usuario.id, fecha).subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.turnos = response.payload;
        } else {
          this.mostrarError('Error al cargar los turnos');
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.mostrarError('Error al cargar los turnos');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onFechaChange() {
    this.cargarTurnos();
  }

  formatearFechaParaAPI(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }

  formatearFechaMostrar(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
