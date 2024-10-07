import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.loading = true;
    console.log('Verificando credenciales...');
    
    timer(3000).pipe(
      switchMap(() => this.authService.login(this.email, this.password))
    ).subscribe(
      success => {
        this.loading = false;
        if (success) {
          console.log('Login exitoso');
          this.router.navigate(['/dashboard']);
        } else {
          console.log('Usuario no encontrado. Por favor, regístrese.');
          alert('Usuario no encontrado. Por favor, regístrese.');
        }
      },
      error => {
        this.loading = false;
        console.error('Error durante el login:', error);
        alert('Ocurrió un error durante el inicio de sesión. Por favor, intente nuevamente.');
      }
    );
  }

  onRegister() {
    console.log('Función de registro llamada');
    this.router.navigate(['/registro']);
  }
}