import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

    mensajeError: string | null = null;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      dni: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
  }

  // metodo para el envio del formulario
  onSubmit(): void {
    if (this.registerForm.valid) {
      const userData = {
        dni: this.registerForm.value.dni,
        apellido: this.registerForm.value.apellido,
        nombre: this.registerForm.value.nombre,
        fecha_nacimiento: this.registerForm.value.fechaNacimiento,
        password: this.registerForm.value.password,
        email: this.registerForm.value.email,
        rol: 'paciente', // rol por defecto
        telefono: this.registerForm.value.telefono, 
      };

      this.authService.crearUsuario(userData).subscribe(
        response => {
          if (response.codigo === 200) {
            this.router.navigate(['/dashboard']);
          } else {
            // Manejar el error de registro
            console.error(response.mensaje);
          }
        },
        error => {
          console.error('Error al crear el usuario:', error);
        }
      );
    }
  }

  onCancel(): void {
    this.registerForm.reset();
    this.router.navigate(['/home']);
  }
}
