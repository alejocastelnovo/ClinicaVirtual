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


  constructor(private http: HttpClient) {
    const usuarioInicial = JSON.parse(localStorage.getItem('usuarioLogueado') || 'null');
    this.usuarioLogueadoSubject = new BehaviorSubject<any>(usuarioInicial);
    this.usuarioLogueado = this.usuarioLogueadoSubject.asObservable();
  }

  login(body: any) {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post(`${this.UrlApi}/login`, body, {headers}).pipe(
      tap((response: any) => {
        this.usuarioLogueado = response.usuario;
        this.usuarioLogueadoSubject.next(this.usuarioLogueado);
      })
    );
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
  
  // Método para registrar usuario
  // Método para registrar usuario
  registrarUsuario(usuario: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.UrlApi}/registro`, usuario, { headers });
  }

  // Método para cerrar sesión (logout)
  logout(): void {
    localStorage.removeItem('authToken');  // elimina el token guardado
    console.log('Sesión cerrada');
  }



  public getUsuarioLogueado(): any {
    return this.usuarioLogueadoSubject.value;
  }

  public getUsuarioLogueadoObservable(): Observable<any> {
    return this.usuarioLogueado;
  }

  public setUsuarioLogueado(user: any): void {
    localStorage.setItem('usuarioLogueado', JSON.stringify(user));
    this.usuarioLogueadoSubject.next(user);
  }


}
