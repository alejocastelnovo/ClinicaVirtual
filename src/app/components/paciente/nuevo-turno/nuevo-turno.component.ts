import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.component.html',
  styleUrls: ['./nuevo-turno.component.css']
})
export class NuevoTurnoComponent implements OnInit {
  cobertura!: string;
  especialidad!: string;
  profesional: any;
  fecha!: Date;
  hora: string = '';
  notas: string = '';

  profesionales: any[] = []; // Aquí deberías cargar los profesionales desde un servicio
  horariosDisponibles: string[] = [];

  mostrarConfirmacion: boolean = false;

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    // Inicializar datos si es necesario
  }

  habilitarSiguienteCampo(campo: string) {
    // Lógica para habilitar el siguiente campo
    // Por ejemplo, si se selecciona la especialidad, cargar los profesionales correspondientes
  }

  cargarHorariosDisponibles() {
    // Lógica para cargar los horarios disponibles según la fecha y el profesional seleccionado
  }

  onSubmit() {
    if (this.profesional && this.fecha && this.hora) {
      this.mostrarConfirmacion = true;
    }
  }

  confirmarTurno() {
    // Aquí puedes guardar el turno en tu base de datos o servicio
    this.router.navigate(['/dashboard']);
  }

  cancelarConfirmacion() {
    this.mostrarConfirmacion = false;
  }

  cancelar() {
    this.router.navigate(['/dashboard']);
  }
}
