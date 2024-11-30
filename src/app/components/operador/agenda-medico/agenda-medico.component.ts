import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OperadorService } from '../../../services/operador.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AgendaService } from '../../../services/agenda.service';

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
    private router: Router,
    private agendaService: AgendaService
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
    this.agendaService.obtenerMedicosConTurnos(fecha).subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.medicosAgenda = response.payload;
        } else {
          this.mostrarError(response.mensaje || 'Error al cargar las agendas de los médicos');
        }
      },
      error: (error) => {
        console.error('Error al cargar agendas de médicos:', error);
        this.mostrarError('Error al cargar las agendas de los médicos');
      },
      complete: () => this.loading = false
    });
  }

  editarAgenda(medicoId: number) {
    this.router.navigate(['/operador/agenda/editar', medicoId, this.fechaSeleccionada]);
  }

  verTurnos(medicoId: number) {
    this.router.navigate(['/operador/agenda/turnos', medicoId, this.fechaSeleccionada]);
  }

  agregarAgenda(medicoId: number) {
    this.router.navigate(['/operador/agenda/agregar', medicoId, this.fechaSeleccionada]);
  }

  mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
  
  formatearHorarios(agendas: any[]): string {
    if (!agendas || agendas.length === 0) {
      return 'Sin horarios disponibles';
    }
    return agendas.map(agenda => `${agenda.hora_entrada} - ${agenda.hora_salida}`).join(', ');
  }

  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}