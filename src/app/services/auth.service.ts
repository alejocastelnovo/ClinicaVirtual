import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface LoginResponse {
  codigo: number;
  mensaje: string;
  payload: any[];
  jwt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token || ''
    });
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crearUsuario`, usuario);
  }

  login(usuario: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { usuario, password })
      .pipe(
        tap(response => {
          if (response.codigo === 200) {
            localStorage.setItem('jwt', response.jwt);
            localStorage.setItem('usuario', JSON.stringify(response.payload[0]));
            localStorage.setItem('rol', response.payload[0].rol.toLowerCase());
            localStorage.setItem('nombre', response.payload[0].nombre);
            localStorage.setItem('apellido', response.payload[0].apellido);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
    localStorage.removeItem('apellido');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwt');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  obtenerEspecialidadMedico(idMedico: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerEspecialidadesMedico/${idMedico}`, {
      headers: this.getHeaders()
    });
  }


  /* Para que me de el usuario actual  */
  getCurrentUser(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  resetPassword(id: number, password: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/login/resetearPassword/${id}`, { password }, 
      { headers: this.getHeaders() });
  }

  actualizarUsuario(cambios: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizarUsuario/${cambios.id}`, cambios, 
      { headers: this.getHeaders() });
  }

  obtenerUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerUsuario/${id}`, 
      { headers: this.getHeaders() });
  }
}
