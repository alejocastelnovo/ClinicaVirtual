import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgendaService } from '../../../services/agenda.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

interface AgendaForm {
  fecha: string;
  horarios: string;
}

@Component({
  selector: 'app-editar-agenda',
  templateUrl: './editar-agenda.component.html',
  styleUrls: ['./editar-agenda.component.css']
})
export class EditarAgendaComponent implements OnInit {
  agendaForm: FormGroup;
  idMedico!: number;
  fecha!: string;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private agendaService: AgendaService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.agendaForm = this.fb.group({
      fecha: ['', Validators.required],
      horarios: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.idMedico = Number(this.route.snapshot.paramMap.get('id_medico'));
    this.fecha = this.route.snapshot.paramMap.get('fecha') || '';
    this.cargarAgenda();
  }

  cargarAgenda(): void {
    this.loading = true;
    this.agendaService.obtenerAgenda(this.idMedico).subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          const agenda = response.payload.find((a: any) => a.fecha === this.fecha);
          if (agenda) {
            this.agendaForm.patchValue({
              fecha: agenda.fecha,
              horarios: `${agenda.hora_entrada}-${agenda.hora_salida}`
            });
          } else {
            this.mostrarError('No se encontró la agenda para la fecha seleccionada');
          }
        } else {
          this.mostrarError(response.mensaje || 'Error al cargar la agenda');
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar la agenda:', error);
        this.mostrarError('Error al cargar la agenda');
      },
      complete: () => this.loading = false
    });
  }

  actualizarAgenda(): void {
    if (this.agendaForm.invalid) {
      return;
    }

    this.loading = true;
    const datos: AgendaForm = this.agendaForm.value;
    const horariosArray: string[] = datos.horarios.split('-').map(horario => horario.trim());

    if (horariosArray.length !== 2) {
      this.mostrarError('El formato de horarios debe ser "hora_inicio-hora_fin"');
      this.loading = false;
      return;
    }

    const [hora_entrada, hora_salida] = horariosArray;

    const agendaActualizada = {
      fecha: datos.fecha,
      hora_entrada,
      hora_salida
    };

    this.agendaService.actualizarAgenda(
      this.idMedico,
      datos.fecha,
      horariosArray
    ).subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.snackBar.open('Agenda actualizada exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/operador/agenda-medico']);
        } else {
          this.mostrarError(response.mensaje || 'Error al actualizar la agenda');
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al actualizar la agenda:', error);
        this.mostrarError('Error al actualizar la agenda');
      },
      complete: () => this.loading = false
    });
  }

  mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
