import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userName: string | null = null;
  userType: string | null = null;
  userTypeShort: string | null = null;
  private userSubscription: Subscription = new Subscription();
  userImagePath: string = 'assets/images/usuario.png';
  logueado: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    const usuarioLogueado = this.authService.getUsuarioLogueado();
    this.updateUserInfo(usuarioLogueado);
    this.mostrarInformacionLocalStorage();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  mostrarInformacionLocalStorage() {
    const infoLocalStorage = localStorage.getItem('usuario'); // Cambia 'usuario' por la clave que uses
    if (infoLocalStorage) {
      console.log('Información en Local Storage:', JSON.parse(infoLocalStorage));
    } else {
      console.log('No hay información en Local Storage.');
    }
  }

  updateUserInfo(user: any) {
    if (user && user.nombre && user.apellido) {
      this.userName = `${user.nombre} ${user.apellido}`;
      this.userType = user.rol || null;
      this.userTypeShort = this.getUserTypeShort(this.userType);
    } else {
      this.userName = null;
      this.userType = null;
      this.userTypeShort = null;
    }
    console.log('Usuario:', this.userName, 'Tipo:', this.userType);
  }

  getUserTypeShort(userType: string | null): string {
    switch (userType) {
      case 'Administrador':
        return ' ';
      case 'Operador':
        return ' ';
      case 'Medico':
        return ' ';
      case 'Paciente':
        return ' ';
      default:
        return '?';
    }
  }

  isLoggedIn(): any {
    return this.userName;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }



  navigateToHome() {
    switch(this.userType) {
      case 'Paciente':
        this.router.navigate(['/dashboard']);
        break;
      case 'Medico':
        this.router.navigate(['/dashboard']);
        break;
      case 'Administrador':
        this.router.navigate(['/dashboard']);
        break;
      case 'Operador':
        this.router.navigate(['/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
