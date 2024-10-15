import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  password: string = '';
  dni: string = ''; // Añadimos la propiedad telefono
  hidePassword = true; // Añadimos la propiedad hidePassword
  fechaNacimiento: string = ''; // Añadimos la propiedad fechaNacimiento

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  /*o nSubmit() {
    const usuarioExiste = this.authService.verificarUsuarioExistente(this.email);

    if (usuarioExiste) {
      this.snackBar.open('El correo electrónico ya está registrado.', 'Cerrar', {
        duration: 5000,
      });
    } else {
      const nuevoUsuario = {
        nombre: this.nombre,
        apellido: this.apellido,
        email: this.email,
        password: this.password,
        dni: this.dni,
        fechaNacimiento: this.fechaNacimiento,
        tipoUsuario: 'Paciente'  // Asignamos automáticamente el rol de paciente
      };

      if (this.authService.registrarUsuario(nuevoUsuario)) {
        this.snackBar.open('Registro exitoso. Por favor, inicie sesión.', 'Cerrar', {
          duration: 5000,
        });
        this.router.navigate(['/login']);
      } else {
        this.snackBar.open('Error al registrar usuario. Intente nuevamente.', 'Cerrar', {
          duration: 5000,
        });
      }
    }
  } */

  onCancel() {
    this.router.navigate(['/home']); 
  }
}