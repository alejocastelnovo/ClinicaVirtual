import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  mensajeError: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{7,8}$')]],
      fechaNacimiento: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      const userData = {
        dni: this.registerForm.value.dni,
        apellido: this.registerForm.value.apellido,
        nombre: this.registerForm.value.nombre,
        fecha_nacimiento: this.registerForm.value.fechaNacimiento,
        password: this.registerForm.value.password,
        email: this.registerForm.value.email,
        rol: 'paciente',
        telefono: this.registerForm.value.telefono,
      };

      this.authService.crearUsuario(userData).subscribe({
        next: (response) => {
          if (response.codigo === 200) {
            this.mostrarMensaje('¡Registro exitoso! Redirigiendo al login...', 'success');
            setTimeout(() => this.router.navigate(['/login']), 2000);
          } else {
            this.mostrarMensaje(response.mensaje || 'Error en el registro', 'error');
          }
        },
        error: (error) => {
          console.error('Error al crear el usuario:', error);
          this.mostrarMensaje('Error en el servidor. Por favor, intente más tarde', 'error');
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.mostrarErroresValidacion();
    }
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  private mostrarErroresValidacion(): void {
    let mensajeError = 'Por favor, corrija los siguientes errores:\n';
    
    if (this.registerForm.get('nombre')?.hasError('required')) {
      mensajeError += '- El nombre es requerido\n';
    }
    if (this.registerForm.get('apellido')?.hasError('required')) {
      mensajeError += '- El apellido es requerido\n';
    }
    if (this.registerForm.get('dni')?.hasError('pattern')) {
      mensajeError += '- El DNI debe tener 7 u 8 dígitos\n';
    }
    if (this.registerForm.get('telefono')?.hasError('pattern')) {
      mensajeError += '- El teléfono debe tener 10 dígitos\n';
    }
    
    this.mostrarMensaje(mensajeError, 'error');
  }

  onCancel(): void {
    this.registerForm.reset();
    this.router.navigate(['/login']);
  }
}
