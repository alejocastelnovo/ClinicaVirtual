import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-medicos',
  templateUrl: './lista-medicos.component.html',
  styleUrls: ['./lista-medicos.component.css']
})
export class ListaMedicosComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'especialidad', 'acciones'];
  medicos: any[] = [];
  fechaSeleccionada: Date = new Date();

  constructor(
    private usuariosService: UsuariosService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    const token = localStorage.getItem('jwt');
    this.usuariosService.obtenerUsuarios(token).subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.medicos = response.payload.filter((usuario: any) => usuario.rol === 'medico');
        } else {
          this.mostrarError(response.mensaje);
        }
      },
      error: (error) => this.mostrarError('Error al cargar médicos')
    });
  }

  onFechaChange() {
    this.cargarMedicos();
  }

  editarAgenda(idMedico: number) {
    this.router.navigate(['/operador/editar-agenda', idMedico]);
  }

  verTurnos(idMedico: number) {
    this.router.navigate(['/operador/ver-turnos', idMedico]);
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }
}