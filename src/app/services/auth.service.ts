import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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


  // Método login con manejo de errores
  login(body: any) {


    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post(`${this.UrlApi}/login`, body, { headers }).pipe(
      tap((response: any) => {
        if (response && response.usuario) {
          this.usuarioLogueado = response.usuario;
          this.usuarioLogueadoSubject.next(this.usuarioLogueado);

          /* Para que guarde el usuario y esconder los botones */
          localStorage.setItem('isLoggedIn', 'true');
        }
      }),
      catchError(error => {
        console.error('Error en el login:', error);
        return throwError(() => error);
      })
    );
  }


  // Método para crear un usuario
  crearUsuario(userData: any): Observable<any> {
    const headers = new HttpHeaders({ "Content-Type": "application/json"
    });
    return this.http.post(`${this.UrlApi}/crearUsuario`, userData, { headers }).pipe(
      catchError(error => {
        console.error('Error al crear el usuario:', error);
        return throwError(() => error);
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

  // Método para cerrar sesión (logout)
  logout(): void {
    localStorage.removeItem('authToken');  // elimina el token guardado
    localStorage.removeItem('isLoggedIn');
    console.log('Sesión cerrada');
  }

  public getUsuarioLogueado(): any {
    // Obtener el usuario del local storage
    const usuarioInicial = JSON.parse(localStorage.getItem('usuarioLogueado') || 'null');
    return usuarioInicial;  
  }

/*   public getUsuarioLogueadoObservable(): Observable<any> {
    return this.usuarioLogueado;
  } */

  public setUsuarioLogueado(user: any): void {
    localStorage.setItem('usuarioLogueado', JSON.stringify(user));
    this.usuarioLogueadoSubject.next(user);
  }


}
