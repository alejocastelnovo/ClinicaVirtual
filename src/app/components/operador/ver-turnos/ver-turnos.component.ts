import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TurnoService } from '../../../services/turno.service';
import { AuthService } from '../../../services/auth.service';

interface Turno {
  id_turno: number;
  nombre_paciente: string;
  fecha_nacimiento: string;
  hora: string;
  nota: string;
  cobertura: string;
}

@Component({
  selector: 'app-ver-turnos',
  templateUrl: './ver-turnos.component.html',
  styleUrls: ['./ver-turnos.component.css']
})
export class VerTurnosComponent implements OnInit {
  medicoId: number;
  fecha: string;
  turnos: Turno[] = [];
  medico: any;
  loading = false;
  displayedColumns: string[] = ['hora', 'paciente', 'edad', 'cobertura', 'nota', 'acciones'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private turnoService: TurnoService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.medicoId = this.route.snapshot.params['id'];
    this.fecha = this.route.snapshot.queryParams['fecha'];
  }

  ngOnInit() {
    this.cargarDatosMedico();
    this.cargarTurnos();
  }

  cargarDatosMedico() {
    this.authService.obtenerUsuario(this.medicoId).subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.medico = response.payload[0];
        }
      },
      error: (error) => this.mostrarError('Error al cargar datos del médico')
    });
  }

  cargarTurnos() {
    this.loading = true;
    this.turnoService.obtenerTurnosMedico(this.medicoId, this.fecha).subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.turnos = response.payload;
        }
      },
      error: (error) => this.mostrarError('Error al cargar los turnos'),
      complete: () => this.loading = false
    });
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    return edad;
  }

  cancelarTurno(turnoId: number) {
    if (confirm('¿Está seguro de que desea cancelar este turno?')) {
      this.loading = true;
      this.turnoService.eliminarTurno(turnoId).subscribe({
        next: (response) => {
          this.mostrarMensaje('Turno cancelado exitosamente');
          this.cargarTurnos();
        },
        error: (error) => this.mostrarError('Error al cancelar el turno'),
        complete: () => this.loading = false
      });
    }
  }

  private mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
