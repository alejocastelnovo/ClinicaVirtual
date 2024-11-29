import { Component, OnInit } from '@angular/core';
import { OperadorService } from '../../../services/operador.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-lista-medicos',
  templateUrl: './lista-medicos.component.html',
  styleUrls: ['./lista-medicos.component.css']
})
export class ListaMedicosComponent implements OnInit {
  fechaSeleccionada: string = this.formatearFecha(new Date());
  medicosConAgenda: any[] = [];
  loading = false;
  displayedColumns: string[] = ['nombre', 'especialidad', 'acciones'];

  constructor(
    private operadorService: OperadorService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarAgendasMedicos(this.fechaSeleccionada);
  }

  cargarAgendasMedicos(fecha: string) {
    this.loading = true;
    this.operadorService.obtenerMedicos().subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          const medicos: any[] = response.payload;
          const agendasObservables = medicos.map(medico => 
            this.operadorService.obtenerAgenda(medico.id).pipe(
              map((agendaResponse: any) => {
                if (agendaResponse.codigo === 200) {
                  const agendasFiltradas = agendaResponse.payload.filter((agenda: any) => this.formatearFecha(new Date(agenda.fecha)) === fecha);
                  return {
                    ...medico,
                    agendas: agendasFiltradas
                  };
                } else {
                  return {
                    ...medico,
                    agendas: []
                  };
                }
              })
            )
          );

          forkJoin(agendasObservables).subscribe({
            next: (medicosConAgendas: any[]) => {
              this.medicosConAgenda = medicosConAgendas.filter(medico => medico.agendas.length > 0);
            },
            error: (error) => {
              console.error('Error al cargar agendas de médicos:', error);
              this.mostrarError('Error al cargar las agendas de los médicos');
            },
            complete: () => this.loading = false
          });
        } else {
          this.mostrarError(response.mensaje || 'Error al cargar los médicos');
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error al cargar médicos:', error);
        this.mostrarError('Error al cargar los médicos');
        this.loading = false;
      }
    });
  }

  onFechaChange(event: any) {
    this.fechaSeleccionada = this.formatearFecha(event.value);
    this.cargarAgendasMedicos(this.fechaSeleccionada);
  }

  editarAgenda(idMedico: number) {
    this.router.navigate(['/operador/agenda/editar', idMedico, this.fechaSeleccionada]);
  }

  verTurnos(idMedico: number) {
    this.router.navigate(['/operador/agenda/turnos', idMedico, this.fechaSeleccionada]);
  }

  mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }

  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}