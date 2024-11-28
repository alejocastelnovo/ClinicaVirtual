import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usuario: any = null;
  userType: string | null = null;

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit() {
    const usuarioString = this.authService.getCurrentUser();
    if (usuarioString) {
      this.usuario = usuarioString;
      this.userType = this.usuario.rol?.toLowerCase();
      console.log('Usuario logueado:', this.usuario);
      console.log('Tipo de usuario:', this.userType);
    } else {
      console.log('No hay usuario logueado');
    }
  }

  navegarA(ruta: string) {
    this.router.navigate([ruta]);
  }
}
