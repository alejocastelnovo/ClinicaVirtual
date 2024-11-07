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
    const userType = localStorage.getItem('rol') ?? '';

    if (!id || !jwt) {
      console.log('No hay usuario logueado o token no disponible');
      return;
    }

    const usuarioString = this.usuariosService.obtenerUsuario(id, jwt);
    usuarioString.subscribe((data: any) => {
      if (data.codigo === 200 && data.payload) {
        this.usuario = data.payload;
        this.userType = this.usuario.rol?.toLowerCase();
        console.log('Usuario logueado:', this.usuario);
        console.log('Tipo de usuario:', this.userType);
      } else {
        console.log('No hay usuario logueado');
      }
    }, error => {
      console.error('Error al obtener el usuario:', error);
    });
  }
}
