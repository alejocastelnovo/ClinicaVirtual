import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usuario: any = null;
  userType: string | null = null;

  constructor(private authService: AuthService, private usuariosService: UsuariosService) {}

  ngOnInit() {
    const id = localStorage.getItem('id') ?? '';
    const jwt = localStorage.getItem('jwt') ?? '';
    const storedRol = localStorage.getItem('rol') ?? '';
    const storedNombreUsuario = localStorage.getItem('nombreUsuario') ?? '';

    if (!id || !jwt) {
      console.log('No hay usuario logueado o token no disponible');
      return;
    }

    this.userType = storedRol.toLowerCase();
    const [nombre, apellido] = storedNombreUsuario.split(' ');

    this.usuario = {
      nombre: nombre || '',
      apellido: apellido || '',
      rol: storedRol
    };

    console.log('Usuario logueado:', this.usuario);
    console.log('Tipo de usuario:', this.userType);
  }
}

