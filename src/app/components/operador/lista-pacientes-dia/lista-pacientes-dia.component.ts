import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OperadorService } from '../../../services/operador.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-pacientes-dia',
  templateUrl: './lista-pacientes-dia.component.html',
  styleUrls: ['./lista-pacientes-dia.component.css']
})
export class ListaPacientesDiaComponent implements OnInit {
  filtroForm: FormGroup;
  loading = false;
  fechaSeleccionada: string = this.formatearFecha(new Date());
  pacientesDia: any[] = [];
  displayedColumns: string[] = ['nombre', 'apellido', 'dni', 'email', 'telefono'];

  constructor(
    private fb: FormBuilder,
    private operadorService: OperadorService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.filtroForm = this.fb.group({
      fecha: [new Date()]
    });
  }

  ngOnInit(): void {
    this.cargarPacientesDia(this.fechaSeleccionada);

    this.filtroForm.get('fecha')?.valueChanges.subscribe(fecha => {
      this.fechaSeleccionada = this.formatearFecha(fecha);
      this.cargarPacientesDia(this.fechaSeleccionada);
    });
  }

  cargarPacientesDia(fecha: string) {
    this.loading = true;
    this.operadorService.obtenerPacientesDia(fecha).subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.pacientesDia = response.payload;
          console.log('Pacientes del día:', this.pacientesDia);
        } else {
          this.mostrarError(response.mensaje || 'Error al cargar los pacientes del día');
        }
      },
      error: (error) => {
        console.error('Error al cargar pacientes del día:', error);
        this.mostrarError('Error al cargar pacientes del día');
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
}
