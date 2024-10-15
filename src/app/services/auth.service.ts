import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarios: any[] = [
    ];
  UrlApi = 'http://localhost:4000/api';
  private usuarioLogueado: any = null;
  private usuarioLogueadoSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  login(body: any) {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post(`${this.UrlApi}/login`, body, {headers}).pipe(
      tap((response: any) => {
        this.usuarioLogueado = response.usuario;
        this.usuarioLogueadoSubject.next(this.usuarioLogueado);
      })
    );
  }

  logout(): void {
    this.usuarioLogueado = null;
    this.usuarioLogueadoSubject.next(null);
  }

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.UrlApi}/usuarios`, usuario);
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.UrlApi}/usuarios`);
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.UrlApi}/usuarios`, usuario);
  }

  editarUsuario(id: number, usuarioEditado: any): Observable<any> {
    return this.http.put(`${this.UrlApi}/usuarios/${id}`, usuarioEditado);
  }

  getUsuarioPorId(id: number): Observable<any> {
    return this.http.get(`${this.UrlApi}/usuarios/${id}`);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.UrlApi}/usuarios/${id}`);
  }

  // Método para obtener el usuario logueado
  getUsuarioLogueado(): any {
    return this.usuarioLogueado;
  }

  // Método para obtener el Observable del usuario logueado
  getUsuarioLogueadoObservable(): Observable<any> {
    return this.usuarioLogueadoSubject.asObservable();
  }

  // Método para actualizar los datos del usuario
  actualizarDatosUsuario(id: number, cambios: any): Observable<any> {
    return this.http.put(`${this.UrlApi}/usuarios/${id}`, cambios).pipe(
      tap((usuarioActualizado: any) => {
        this.usuarioLogueado = usuarioActualizado;
        this.usuarioLogueadoSubject.next(this.usuarioLogueado);
      })
    );
  }

}
