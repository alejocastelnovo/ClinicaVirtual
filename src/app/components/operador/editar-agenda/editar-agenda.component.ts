import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgendaService } from '../../../services/agenda.service';
import { AuthService } from '../../../services/auth.service';

interface ResponseData {
  codigo: number;
  mensaje: string;
  payload: any;
}

@Component({
  selector: 'app-editar-agenda',
  templateUrl: './editar-agenda.component.html',
  styleUrls: ['./editar-agenda.component.css']
})
export class EditarAgendaComponent implements OnInit {
  agendaForm: FormGroup;
  medicoId: number;
  loading = false;
  medico: any;
onSubmit: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private agendaService: AgendaService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.medicoId = this.route.snapshot.params['id'];
    this.agendaForm = this.fb.group({
      fecha: ['', Validators.required],
      hora_entrada: ['', Validators.required],
      hora_salida: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarDatosMedico();
    this.cargarAgenda();
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

  cargarAgenda() {
    this.loading = true;
    this.agendaService.obtenerAgenda(this.medicoId).subscribe({
      next: (response) => {
        if (response.codigo === 200 && response.payload.length > 0) {
          const agenda = response.payload[0];
          this.agendaForm.patchValue({
            fecha: agenda.fecha,
            hora_entrada: agenda.hora_entrada,
            hora_salida: agenda.hora_salida
          });
        }
      },
      error: (error) => this.mostrarError('Error al cargar la agenda'),
      complete: () => this.loading = false
    });
  }

  guardarAgenda() {
    if (this.agendaForm.valid) {
      const agendaData = {
        hora_entrada: this.agendaForm.value.hora_entrada,
        hora_salida: this.agendaForm.value.hora_salida
      };

      this.agendaService.modificarAgenda(this.medicoId, agendaData).subscribe({
        next: (response: ResponseData) => {
          if (response.codigo === 200) {
            this.mostrarExito('Agenda actualizada correctamente');
            this.router.navigate(['/operador/lista-medicos']);
          }
        },
        error: (error: any) => this.mostrarError('Error al actualizar la agenda'),
        complete: () => this.loading = false
      });
    }
  }

  private mostrarExito(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
