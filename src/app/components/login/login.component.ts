import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup = this.fb.group({
    usuario: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<LoginComponent>,
  ) {
    // Si ya está logueado, redirigir al dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { usuario, password } = this.loginForm.value;
      this.authService.login(usuario, password).subscribe({
        next: (response) => {
          if (response.codigo === 200) {
            
            localStorage.setItem('jwt', response.jwt)
            localStorage.setItem('id', response.payload[0].id);
            localStorage.setItem('rol', response.payload[0].rol);
            localStorage.setItem('nombreUsuario', response.payload[0].nombre + ' ' + response.payload[0].apellido);

            this.router.navigate(['/dashboard']);
            this.dialogRef.close();
          } else {
            this.mostrarError(response.mensaje || 'Error en el inicio de sesión');
          }
        },
        error: (error) => {
          console.error('Error en login:', error);
          this.mostrarError('Error en el inicio de sesión. Por favor, intente nuevamente.');
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.mostrarError('Por favor, complete todos los campos');
    }
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
}