import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgendaService } from '../../../services/agenda.service';
import { OperadorService } from '../../../services/operador.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EspecialidadService } from '../../../services/especialidad.service';

@Component({
  selector: 'app-agregar-agenda',
  templateUrl: './agregar-agenda.component.html',
  styleUrls: ['./agregar-agenda.component.css']
})
export class AgregarAgendaComponent implements OnInit {
  agendaForm: FormGroup;
  idMedico!: number;
  fecha!: string;
  loading = false;
  especialidades: any[] = [];
  horariosEntrada: string[] = ['08:00', '09:00', '10:00', '11:00', '12:00'];
  horariosSalida: string[] = ['13:00', '14:00', '15:00', '16:00', '17:00'];

  constructor(
    private fb: FormBuilder,
    private agendaService: AgendaService,
    private operadorService: OperadorService,
    private especialidadService: EspecialidadService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.agendaForm = this.fb.group({
      fecha: ['', Validators.required],
      especialidad: ['', Validators.required],
      medico: ['', Validators.required],
      hora_entrada: ['', Validators.required],
      hora_salida: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.idMedico = Number(this.route.snapshot.paramMap.get('id_medico'));
    this.fecha = this.route.snapshot.paramMap.get('fecha') || this.formatearFecha(new Date());

    // Preseleccionar la fecha en el formulario
    this.agendaForm.patchValue({
      fecha: new Date(this.fecha)
    });

    this.cargarEspecialidades();
  }

  cargarEspecialidades() {
    this.loading = true;
    this.especialidadService.obtenerEspecialidades().subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.especialidades = response.payload;
        } else {
          this.mostrarError(response.mensaje || 'Error al cargar especialidades');
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar especialidades:', error);
        this.mostrarError('Error al cargar especialidades');
      },
      complete: () => this.loading = false
    });
  }

  cargarMedicosPorEspecialidad(especialidadId: number) {
    this.loading = true;
    this.especialidadService.obtenerMedicoPorEspecialidad(especialidadId).subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.agendaForm.patchValue({ medico: '' }); // Resetear selección de médico
          this.medicos = response.payload;
        } else {
          this.mostrarError(response.mensaje || 'No hay médicos disponibles para esta especialidad');
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar médicos:', error);
        this.mostrarError('Error al cargar médicos');
      },
      complete: () => this.loading = false
    });
  }

  agregarAgenda(): void {
    if (this.agendaForm.invalid) {
      return;
    }

    this.loading = true;
    const datos = this.agendaForm.value;
    const fechaFormateada = this.formatearFecha(datos.fecha);

    const nuevaAgenda = {
      id_medico: datos.medico,
      fecha: fechaFormateada,
      hora_entrada: datos.hora_entrada,
      hora_salida: datos.hora_salida
    };

    this.agendaService.crearAgenda(nuevaAgenda).subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.snackBar.open('Agenda creada exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/operador/agenda-medico']);
        } else {
          this.mostrarError(response.mensaje || 'Error al crear la agenda');
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al crear la agenda:', error);
        this.mostrarError('Error al crear la agenda');
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

  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Lista de médicos según especialidad
  medicos: any[] = [];
}
