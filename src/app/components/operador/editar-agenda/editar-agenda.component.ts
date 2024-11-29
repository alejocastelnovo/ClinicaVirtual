import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgendaService } from '../../../services/agenda.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editar-agenda',
  templateUrl: './editar-agenda.component.html',
  styleUrls: ['./editar-agenda.component.css']
})
export class EditarAgendaComponent implements OnInit {
  editarAgendaForm: FormGroup;
  loading = false;
  idMedico!: number;
  fecha!: string;
  agendaActual: any;

  constructor(
    private route: ActivatedRoute,
    private agendaService: AgendaService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public router: Router
  ) {
    this.editarAgendaForm = this.fb.group({
      hora_entrada: ['', Validators.required],
      hora_salida: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.idMedico = Number(this.route.snapshot.paramMap.get('id_medico'));
    this.fecha = this.route.snapshot.paramMap.get('fecha') || '';

    this.cargarAgenda();
  }

  cargarAgenda() {
    this.loading = true;
    this.agendaService.obtenerAgenda(this.idMedico).subscribe({
      next: (response: any) => {
        if (response.codigo === 200 && response.payload.length > 0) {
          this.agendaActual = response.payload[0];
          this.editarAgendaForm.patchValue({
            hora_entrada: this.agendaActual.hora_entrada,
            hora_salida: this.agendaActual.hora_salida
          });
        } else {
          this.mostrarError('No se encontró la agenda para este médico');
        }
      },
      error: (error: any) => {
        console.error('Error al cargar la agenda:', error);
        this.mostrarError('Error al cargar la agenda del médico');
      },
      complete: () => this.loading = false
    });
  }

  onSubmit() {
    if (this.editarAgendaForm.valid) {
      const agendaData = this.editarAgendaForm.value;

      this.loading = true;
      this.agendaService.modificarAgenda(this.agendaActual.id, agendaData).subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.codigo === 200) {
            this.mostrarExito('Agenda actualizada exitosamente');
            this.router.navigate(['/operador/agenda-medico']);
          } else {
            this.mostrarError(response.mensaje || 'Error al actualizar la agenda');
          }
        },
        error: (error: any) => {
          console.error('Error al actualizar la agenda:', error);
          this.mostrarError('Error al actualizar la agenda');
          this.loading = false;
        }
      });
    } else {
      this.mostrarError('Por favor, complete todos los campos requeridos');
    }
  }

  mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  mostrarExito(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
