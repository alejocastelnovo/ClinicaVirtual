import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent {
  // Propiedades para el formulario
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  tipoUsuario: string = '';
  password: string = '';

  constructor(private router: Router) {}

  // Método para manejar el envío del formulario
  onSubmit() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const nuevoUsuario = { nombre: this.nombre, apellido: this.apellido, email: this.email, tipoUsuario: this.tipoUsuario, password: this.password };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Usuario creado con éxito.');
    this.router.navigate(['/administrador/gestion-usuarios']);
  }

  // Método para manejar la cancelación
  onCancel(): void {
    this.router.navigate(['/administrador/gestion-usuarios']);
  }
}
