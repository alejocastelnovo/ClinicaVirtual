import { Component, OnInit } from '@angular/core';

interface Turno {
  fecha: Date;
  especialista: string;
  especialidad: string;
  expandido: boolean;
}

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent implements OnInit {
  turnos: Turno[] = [];

  ngOnInit() {
    // Aquí deberías cargar los turnos desde un servicio
    this.cargarTurnos();
  }

  cargarTurnos() {
    // Ejemplo de datos, reemplazar con llamada a servicio real
    this.turnos = [
      {
        fecha: new Date('2024-09-30T15:00:00'),
        especialista: 'Pedro Luis Pérez',
        especialidad: 'Traumatología',
        expandido: false
      },
      // Agregar más turnos aquí...
    ];

    // Ordenar turnos del más próximo al menos próximo
    this.turnos.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  }

  toggleExpandirTurno(turno: Turno) {
    turno.expandido = !turno.expandido;
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
