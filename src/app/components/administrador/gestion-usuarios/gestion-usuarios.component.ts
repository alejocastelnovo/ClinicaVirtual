import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  filtroNombre: string = '';
  filtroApellido: string = '';
  filtroTipo: string = '';

  displayedColumns: string[] = ['nombre', 'apellido', 'email', 'userType', 'acciones'];

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.authService.getUsuarios().subscribe(
      usuarios => {
        this.usuarios = usuarios;
        this.applyFilter();
      },
      error => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  applyFilter() {
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      return (
        usuario.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()) &&
        usuario.apellido.toLowerCase().includes(this.filtroApellido.toLowerCase()) &&
        (this.filtroTipo ? usuario.userType === this.filtroTipo : true)
      );
    });
  }

  editarUsuario(id: number) {
    this.router.navigate(['/administrador/editar-usuario', id]);
  }

  crearUsuario() {
    this.router.navigate(['/administrador/crear-usuario']);
  }

  confirmarEliminarUsuario(usuario: any) {
    const confirmacion = confirm(`¿Está seguro que desea eliminar al usuario ${usuario.nombre}?`);
    if (confirmacion) {
      this.eliminarUsuario(usuario.id);
    }
  }

  eliminarUsuario(id: number) {
    this.authService.eliminarUsuario(id).subscribe(
      success => {
        if (success) {
          this.cargarUsuarios();
        } else {
          console.error('Error al eliminar usuario');
        }
      },
      error => {
        console.error('Error al eliminar usuario:', error);
      }
    );
  }
}
