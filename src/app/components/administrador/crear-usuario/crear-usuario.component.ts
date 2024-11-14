import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';


@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent {
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  tipoUsuario: string = '';
  password: string = '';
  dni: string = '';
  telefono: string = '';
  fechaNacimiento: string = '';

  constructor(
    private router: Router,
    private usuariosService: UsuariosService
  ) {}


  onSubmit() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const nuevoUsuario = { 
      dni: this.dni,
      nombre: this.nombre, 
      apellido: this.apellido, 
      fecha_nacimiento: this.fechaNacimiento,
      email: this.email, 
      password: this.password,
      rol: this.formatearRol(this.tipoUsuario),
      telefono: this.telefono
    };

    const token = localStorage.getItem('jwt');

    this.usuariosService.crearUsuario(nuevoUsuario, token).subscribe(
      (response) => {
        alert('Usuario creado con éxito.');
        this.router.navigate(['/administrador/gestion-usuarios']);
      },
      (error) => {
        alert('Error al crear el usuario: ' + error.message);
      }
    );
    
  }
  private formatearRol(rol: string): string {
    return rol.toLowerCase().replace(/[^a-z]/g, '');
  }
  

  onCancel(): void {
    this.router.navigate(['/administrador/gestion-usuarios']);
  }
  
}
