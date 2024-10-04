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
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        console.log('Inicio de sesión exitoso', response);
        this.dialog.closeAll();
      },
      (error) => {
        console.error('Error en el inicio de sesión', error);
        // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
      }
    );
  }
}
