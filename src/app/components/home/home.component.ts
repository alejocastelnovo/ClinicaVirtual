import { Component, ViewChild, TemplateRef  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../registro/registro.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  loginForm: FormGroup;
  isLoggedIn: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  abrirLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Inicio de sesión exitoso');
      }
    });
  }

  abrirRegisterDialog() {
    const dialogRef = this.dialog.open(RegisterComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Registro exitoso');
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/registro']);
  }

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

      const usuario = usuarios.find((u: any) => u.email === username && u.password === password);

      if (usuario) {
        localStorage.setItem('userName', `${usuario.nombre} ${usuario.apellido}`);
        localStorage.setItem('userType', 'Paciente');
        this.isLoggedIn = true;

        this.dialog.closeAll();
        this.router.navigate(['/dashboard']);
      } else {
        alert('Usuario no encontrado. Por favor, regístrese.');
      }
    }
  }
}
