import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  loginForm: FormGroup;
  mensajeError: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = new FormGroup({
      usuario: new FormControl('', [Validators.required, Validators.email]),
      contrasenia: new FormControl('', [Validators.required])
    });
  }

  login() {
    let body = {
      usuario: this.loginForm.controls['usuario'].value,
      password: this.loginForm.controls['contrasenia'].value
    };
    console.log(JSON.stringify(body));
    this.authService.login(JSON.stringify(body)).subscribe((data: any) => {
      if (data.codigo == 200) {
        console.log(data);

        localStorage.setItem('token', data.jwt);
        localStorage.setItem('usuario', data.payload[0].nombre + ' ' + data.payload[0].apellido);
        localStorage.setItem('id', data.payload[0].id)
        localStorage.setItem('rol', data.payload[0].rol);

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      } else {
        alert('Usuario o contraseña incorrectos.');
        console.log(data.mensaje);
        this.mensajeError = data.mensaje; // Actualiza el mensaje de error
      }
    }
    );
  }

  onRegister() {
    this.router.navigate(['/registro']);
  }
}