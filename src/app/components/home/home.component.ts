import { Component, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  username: string = '';
  password: string = '';
  
  @ViewChild('loginDialog') loginDialog!: TemplateRef<any>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  openLoginDialog() {
    const dialogRef = this.dialog.open(this.loginDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // El usuario ha iniciado sesión correctamente
        console.log('Inicio de sesión exitoso');
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/registro']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  
  login() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  
    // Verificar si el usuario existe
    const usuario = usuarios.find((u: any) => u.email === this.username && u.password === this.password);
  
    if (usuario) {
      // Guardar los datos del usuario actual en localStorage
      localStorage.setItem('userName', `${usuario.nombre} ${usuario.apellido}`);
      localStorage.setItem('userType', 'Paciente');  // Puedes modificar esto según el tipo de usuario
  
      this.closeLogin();
      this.router.navigate(['/dashboard']);  // Redirigir a la pantalla principal
    } else {
      alert('Usuario no encontrado. Por favor, regístrese.');
    }
  }
  
  
  closeLogin() {
    // Implementa la lógica para cerrar el login aquí
  }
}
