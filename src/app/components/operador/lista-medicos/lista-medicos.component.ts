import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { AgendaService } from '../../../services/agenda.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-lista-medicos',
  templateUrl: './lista-medicos.component.html',
  styleUrls: ['./lista-medicos.component.css']
})
export class ListaMedicosComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'especialidad', 'horario', 'acciones'];
  medicos: any[] = [];
  fechaSeleccionada = new FormControl(new Date());
  loading = false;
  medicosConAgenda: any[] = [];

  constructor(
    private usuariosService: UsuariosService,
    private agendaService: AgendaService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.loading = true;
    this.usuariosService.obtenerMedicos().subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.medicos = response.payload.filter((usuario: any) => usuario.rol === 'medico');
          this.cargarAgendasMedicos();
        } else {
          this.mostrarError('No hay médicos disponibles');
        }
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.mostrarError('Error al cargar médicos');
      },
      complete: () => this.loading = false
    });
  }

  cargarAgendasMedicos() {
    const fecha = this.formatearFecha(this.fechaSeleccionada.value!);
    this.medicosConAgenda = [];
    
    this.medicos.forEach(medico => {
      this.agendaService.obtenerAgenda(medico.id_usuario).subscribe({
        next: (response: any) => {
          if (response.codigo === 200 && response.payload.length > 0) {
            const agendasDelDia = response.payload.filter((agenda: any) => agenda.fecha === fecha);
            
            if (agendasDelDia.length > 0) {
              this.medicosConAgenda.push({
                id_medico: medico.id_usuario,
                nombre: medico.nombre,
                apellido: medico.apellido,
                especialidad: medico.especialidad,
                horario: `${agendasDelDia[0].hora_entrada} - ${agendasDelDia[0].hora_salida}`
              });
            }
          }
        },
        error: (error: any) => {
          console.error(`Error al obtener agenda para médico ID ${medico.id_usuario}:`, error);
        }
      });
    });
  }

  onFechaChange() {
    this.cargarAgendasMedicos();
  }

  editarAgenda(idMedico: number) {
    const fecha = this.formatearFecha(this.fechaSeleccionada.value!);
    this.router.navigate(['/operador/editar-agenda', idMedico], {
      queryParams: { fecha: fecha }
    });
  }

  verTurnos(idMedico: number) {
    const fecha = this.formatearFecha(this.fechaSeleccionada.value!);
    this.router.navigate(['/operador/ver-turnos', idMedico], {
      queryParams: { fecha: fecha }
    });
  }

  private formatearFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }

  crearPaciente() {
    this.router.navigate(['/operador/crear-paciente']);
  }

  asignarTurno() {
    this.router.navigate(['/operador/asignar-turno']);
  }
}