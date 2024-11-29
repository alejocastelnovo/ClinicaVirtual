import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OperadorService } from '../../../services/operador.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgendaService } from 'src/app/services/agenda.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-agenda-medico',
  templateUrl: './agenda-medico.component.html',
  styleUrls: ['./agenda-medico.component.css']
})
export class AgendaMedicoComponent implements OnInit {
  filtroForm: FormGroup;
  loading = false;
  fechaSeleccionada: string = this.formatearFecha(new Date());
  medicosAgenda: any[] = [];
  displayedColumns: string[] = ['nombre', 'especialidad', 'horario', 'acciones'];

  constructor(
    private fb: FormBuilder,
    private operadorService: OperadorService,
    private snackBar: MatSnackBar,
    private agendaService: AgendaService,
    private router: Router
  ) {
    this.filtroForm = this.fb.group({
      fecha: [new Date()]
    });
  }

  ngOnInit(): void {
    this.cargarMedicosAgenda(this.fechaSeleccionada);

    this.filtroForm.get('fecha')?.valueChanges.subscribe(fecha => {
      this.fechaSeleccionada = this.formatearFecha(fecha);
      this.cargarMedicosAgenda(this.fechaSeleccionada);
    });
  }

  cargarMedicosAgenda(fecha: string) {
    this.loading = true;
    this.operadorService.obtenerMedicos().subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          const medicos: any[] = response.payload;
          // Para cada médico, obtener su agenda para la fecha seleccionada
          const agendasObservables = medicos.map(medico => 
            this.agendaService.obtenerAgenda(medico.id).pipe(
              map((agendaResponse: any) => {
                if (agendaResponse.codigo === 200) {
                  // Filtrar agendas por la fecha seleccionada
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
              this.medicosAgenda = medicosConAgendas;
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
        console.error('Error al obtener médicos:', error);
        this.mostrarError('Error al obtener los médicos');
        this.loading = false;
      }
    });
  }

  editarAgenda(medicoId: number) {
    this.router.navigate(['/operador/editar-agenda', medicoId, this.fechaSeleccionada]);
  }

  verTurnos(medicoId: number) {
    this.router.navigate(['/operador/ver-turnos', medicoId, this.fechaSeleccionada]);
  }

  mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}