import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TurnoService } from '../../../services/turno.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Turno {
  id_turno: number;
  paciente: {
    nombre: string;
    apellido: string;
  };
  hora_inicio: string;
  hora_fin: string;
  nota: string;
}

@Component({
  selector: 'app-ver-turnos',
  templateUrl: './ver-turnos.component.html',
  styleUrls: ['./ver-turnos.component.css']
})
export class VerTurnosComponent implements OnInit {
  idMedico!: number;
  fecha!: string;
  turnos: Turno[] = [];
  displayedColumns: string[] = ['paciente', 'hora', 'nota'];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private turnoService: TurnoService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.idMedico = Number(this.route.snapshot.paramMap.get('id_medico'));
    this.fecha = this.route.snapshot.paramMap.get('fecha') || '';
    this.cargarTurnos();
  }

  cargarTurnos() {
    this.loading = true;
    this.turnoService.obtenerTurnosMedico(this.idMedico, this.fecha).subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.turnos = response.payload.map((turno: any) => ({
            id_turno: turno.id_turno,
            paciente: {
              nombre: turno.nombre_paciente || turno.paciente?.nombre || '',
              apellido: turno.apellido_paciente || turno.paciente?.apellido || ''
            },
            hora_inicio: turno.hora_inicio || turno.hora || '',
            hora_fin: turno.hora_fin || '',
            nota: turno.nota || 'Sin notas'
          }));
          console.log('Turnos procesados:', this.turnos);
        } else {
          this.mostrarError(response.mensaje || 'Error al cargar los turnos');
        }
      },
      error: (error: any) => {
        console.error('Error al cargar turnos:', error);
        this.mostrarError('Error al cargar turnos');
      },
      complete: () => this.loading = false
    });
  }

  mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
