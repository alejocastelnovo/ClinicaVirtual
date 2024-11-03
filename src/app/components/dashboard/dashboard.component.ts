import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string | null = localStorage.getItem('usuario');
  userType: string | null = localStorage.getItem('rol');

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const usuarioLogueado = this.authService.getUsuarioLogueado();
    if (usuarioLogueado) {
      console.log('El usuario logueado es,', this.userName);
    } else {
      console.log('No hay usuario logueado.');
    }
  }
}
