import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuariosUrl = 'assets/backend.json';  // URL al archivo JSON simulado
  private usuarioLogueado: any = null;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<any>(this.usuariosUrl).pipe(
      map(data => {
        const usuario = data.usuarios.find((u: any) => u.email === email && u.password === password);
        if (usuario) {
          this.usuarioLogueado = usuario;
          localStorage.setItem('usuario', JSON.stringify(usuario));  // Simulación de sesión
          return true;
        }
        return false;
      })
    );
  }

  logout(): void {
    this.usuarioLogueado = null;
    localStorage.removeItem('usuario');  // Simulación de cierre de sesión
  }

  esUsuarioAdministrador(): boolean {
    const usuario = JSON.parse(localStorage.getItem('usuario')!);
    return usuario && usuario.rol === 'admin';
  }

  getUsuarioLogueado() {
    return this.usuarioLogueado;
  }
}
