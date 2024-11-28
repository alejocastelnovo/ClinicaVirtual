import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  coberturas: any[] = [];
  loading = false;
  mensajeError: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private snackBar: MatSnackBar,
    private especialidadService: EspecialidadService,
    private dialogRef: MatDialogRef<RegisterComponent>
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{7,8}$')]],
      fechaNacimiento: ['', Validators.required],
      telefono: ['', [Validators.required]],
      cobertura: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarCoberturas();
  }

  cargarCoberturas() {
    this.especialidadService.obtenerCoberturas().subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.coberturas = response.payload;
        }
      },
      error: (error) => {
        this.snackBar.open('Error al cargar las coberturas', 'Cerrar', { duration: 3000 });
      }
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
        id_cobertura: this.registerForm.get('cobertura')?.value
      };

      this.authService.crearUsuario(userData).subscribe({
        next: (response) => {
          if (response.codigo === 200) {
            this.mostrarMensaje('¡Registro exitoso! Redirigiendo al home...', 'success');
            setTimeout(() => this.router.navigate(['/home']), 2000);
            this.dialogRef.close();

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
    this.dialogRef.close();
  }
}
