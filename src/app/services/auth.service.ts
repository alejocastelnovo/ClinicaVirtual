import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarios: any[] = [
    { id: 1, nombre: 'Lautaro', apellido: 'Cortez', email: 'lautycortez725@gmail.com', password: '1234', dni: '3425458005', userType: 'Administrador', fechaNacimiento: '2003-12-23' },
    { id: 2, nombre: 'Alejo', apellido: 'Castelnovo', email: 'castelnovo12@gmail.com', password: '123', dni: '0987654321', userType: 'Administrador', fechaNacimiento: '2001-2-12' },
    { id: 3, nombre: 'Juan', apellido: 'Perez', email: 'juanperez@gmail.com', password: '123', dni: '1234567890', userType: 'Paciente', fechaNacimiento: '1990-05-15' },
    { id: 4, nombre: 'Maria', apellido: 'Gomez', email: 'mariagomez@gmail.com', password: '123', dni: '0987654321', userType: 'Medico', fechaNacimiento: '1985-09-22' },
    { id: 5, nombre: 'Carlos', apellido: 'Lopez', email: 'carloslopez@gmail.com', password: '123', dni: '1234567890', userType: 'Operador', fechaNacimiento: '1978-11-30' },
  ];
  UrlApi = 'http://localhost:4000/api';
  private usuarioLogueado: any = null;
  private usuarioLogueadoSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  login(body: any) {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    
  
    return this.http.post(`${this.UrlApi}/login`, body, {headers})
  }

  logout(): void {
    this.usuarioLogueado = null;
    this.usuarioLogueadoSubject.next(null);
  }

  registrarUsuario(usuario: any): boolean {
    usuario.id = this.usuarios.length + 1;
    this.usuarios.push(usuario);
    return true;
  }

  getUsuarioLogueado() {
    return this.usuarioLogueado;
  }

  getUsuarioLogueadoObservable(): Observable<any> {
    return this.usuarioLogueadoSubject.asObservable();
  }

  esUsuarioAdministrador(): boolean {
    return this.usuarioLogueado && this.usuarioLogueado.userType === 'Administrador';
  }

  verificarUsuarioExistente(email: string): boolean {
    // Buscar un usuario con el email proporcionado
    const usuarioExistente = this.usuarios.find(u => u.email === email);
    
    // Retornar true si se encuentra un usuario, false en caso contrario
    return !!usuarioExistente;
  }

  actualizarDatosUsuario(id: number, cambios: any): boolean {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      this.usuarios[index] = { ...this.usuarios[index], ...cambios };
      if (this.usuarioLogueado && this.usuarioLogueado.id === id) {
        this.usuarioLogueado = { ...this.usuarioLogueado, ...cambios };
        this.usuarioLogueadoSubject.next(this.usuarioLogueado);
      }
      return true;
    }
    return false;
  }

  getUsuarios(): Observable<any[]> {
    return of(this.usuarios);
  }

  crearUsuario(usuario: any): Observable<boolean> {
    usuario.id = this.usuarios.length + 1;
    this.usuarios.push(usuario);
    return of(true);
  }

  editarUsuario(id: number, usuarioEditado: any): Observable<boolean> {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      this.usuarios[index] = { ...this.usuarios[index], ...usuarioEditado };
      return of(true);
    }
    return of(false);
  }

  getUsuarioPorId(id: number): Observable<any> {
    const usuario = this.usuarios.find(u => u.id === id);
    return of(usuario);
  }

  eliminarUsuario(id: number): Observable<boolean> {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      this.usuarios.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

}
