import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../services/login.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  token: any;
  rol: any;
  id: any;
  hoy: Date = new Date();

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private snackbar: MatSnackBar, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { isLoginMode: boolean },
    @Optional() private dialogRef: MatDialogRef<RegisterComponent>,
    private LoginService: LoginService,

  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{7,8}$')]],
      fechaNacimiento: ['', Validators.required],
      telefono: ['', [Validators.required]],
    });
  }

  register(): void {
    let body = {
      dni: this.registerForm.controls['dni'].value,
      apellido: this.registerForm.controls['apellido'].value,
      nombre: this.registerForm.controls['nombre'].value,
      fecha_nacimiento: this.registerForm.controls['fechaNacimiento'].value,
      password: this.registerForm.controls['password'].value,
      rol: 'paciente',
      email: this.registerForm.controls['email'].value,
      telefono: this.registerForm.controls['telefono'].value,
    }
    
    this.LoginService.register(JSON.stringify(body)).subscribe((data: any) => {
      if (data.codigo === 200) {
        this.openSnackBar('Usuario creado correctamente', 'Aceptar')
        this.dialogRef.close(true);
      } else {
        this.openSnackBar(data.mensaje, 'Aceptar')
      }
    })
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.snackbar.open(mensaje, 'Cerrar', {
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

  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, { duration: 2000 });
  }

}

