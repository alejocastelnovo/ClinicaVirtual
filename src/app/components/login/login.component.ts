import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar
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
            this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            
            //dashboard general
            this.router.navigate(['/dashboard']);
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

  onRegister() {
    this.router.navigate(['/registro']);
  }
}