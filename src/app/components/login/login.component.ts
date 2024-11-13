import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';


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
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,

  ) {

    this.loginForm = this.fb.group({
      dni: ['', Validators.required],
      password: ['', Validators.required],
    });


    // Si ya está logueado, lo manda al dashboard
    if (this.authService.isLoggedin()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    let body = {
      usuario: this.loginForm.controls['dni'].value,
      password: this.loginForm.controls['password'].value 
    };

    this.loginService.login(JSON.stringify(body)).subscribe((data: any) => {
      if (data.codigo === 200 && data.payload.length > 0) {
        localStorage.setItem('jwt', data.jwt)
        localStorage.setItem('id', data.payload[0].id);
        localStorage.setItem('rol', data.payload[0].rol);
        localStorage.setItem('nombreUsuario', data.payload[0].nombre + ' ' + data.payload[0].apellido);
        localStorage.setItem('usuario', JSON.stringify(data.payload[0]));
        this.router.navigate(['/dashboard']);
      }else{
        this.mostrarError(data.mensaje || 'Error en el inicio de sesión');
      }
    })
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