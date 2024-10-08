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
  tipoUsuario: string = 'Paciente'; // Valor por defecto
  hidePassword = true; // Añadimos la propiedad hidePassword

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
      userType: this.tipoUsuario
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

  onCancel() {
    // Implementamos el método onCancel
    this.router.navigate(['/login']); // O a donde quieras que vaya al cancelar
  }

  tiposUsuario = [
    {value: 'paciente', viewValue: 'Paciente'},
    {value: 'operador', viewValue: 'Operador'},
    {value: 'medico', viewValue: 'Medico'}
  ];
}