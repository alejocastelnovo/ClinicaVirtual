import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../../services/turno.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

interface Turno {
  id: number;
  fecha: string;
  hora: string;
  especialista: string;
  especialidad: string;
  estado: string;
  nota: string;
  expandido?: boolean;
}

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent implements OnInit {
  turnos: Turno[] = [];
  loading = false;
  usuario: any;

  constructor(
    private turnoService: TurnoService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuario = this.authService.getCurrentUser();
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarTurnos();
  }

  cargarTurnos() {
    this.loading = true;
    this.turnoService.obtenerTurnosPaciente(this.usuario.id).subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.turnos = response.payload.map((turno: any) => ({
            ...turno,
            expandido: false
          }));
          // Ordenar por fecha y hora
          this.turnos.sort((a, b) => {
            const fechaA = new Date(`${a.fecha} ${a.hora}`);
            const fechaB = new Date(`${b.fecha} ${b.hora}`);
            return fechaA.getTime() - fechaB.getTime();
          });
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

  toggleExpandirTurno(turno: Turno) {
    turno.expandido = !turno.expandido;
  }

  cancelarTurno(turnoId: number) {
    if (confirm('¿Está seguro que desea cancelar este turno?')) {
      this.loading = true;
      this.turnoService.eliminarTurno(turnoId).subscribe({
        next: (response) => {
          if (response.codigo === 200) {
            this.mostrarMensaje('Turno cancelado exitosamente');
            this.cargarTurnos();
          } else {
            this.mostrarError('Error al cancelar el turno');
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.mostrarError('Error al cancelar el turno');
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  private mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000
    });
  }
}
