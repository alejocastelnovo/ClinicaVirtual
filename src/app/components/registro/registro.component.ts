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

  onSubmit() {
    const nuevoUsuario = {
        nombre: this.nombre,
        apellido: this.apellido,
        email: this.email,
        password: this.password,
        dni: this.dni,
        fecha_nacimiento: this.fechaNacimiento,
        rol: 'Paciente',  // Asignamos automáticamente el rol de paciente
        telefono: ''  // Añadimos un campo vacío para el teléfono
    };

    this.authService.registrarUsuario(nuevoUsuario).subscribe(
        (response) => {
            this.snackBar.open('Registro exitoso. Por favor, inicie sesión.', 'Cerrar', {
                duration: 5000,
            });
            this.router.navigate(['/login']);
        },
        (error) => {
            this.snackBar.open('Error al registrar usuario. Intente nuevamente.', 'Cerrar', {
                duration: 5000,
            });
        }
    );
}

  onCancel() {
    this.router.navigate(['/home']); 
  }
}