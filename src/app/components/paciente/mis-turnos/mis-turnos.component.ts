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
            id: turno.id_turno,
            fecha: turno.fecha,
            hora: turno.hora,
            especialista: `${turno.nombre_medico} ${turno.apellido_medico}`,
            especialidad: turno.especialidad,
            estado: turno.estado,
            nota: turno.nota || 'Sin notas',
            expandido: false
          }));
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

  formatearFecha(fecha: string): string {
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(fecha).toLocaleDateString('es-AR', opciones);
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  cancelarTurno(turnoId: number) {
    if (confirm('¿Está seguro que desea cancelar este turno?')) {
      this.loading = true;
      this.turnoService.eliminarTurno(turnoId).subscribe({
        next: (response: any) => {
          if (response.payload.affectedRows > 0) {
            this.mostrarMensaje('Turno cancelado exitosamente');
            this.cargarTurnos();
          } else {
            this.mostrarError('No se pudo cancelar el turno');
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

  private mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
