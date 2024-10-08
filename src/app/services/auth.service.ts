import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarios: any[] = [
    { id: 1, nombre: 'Lautaro', apellido: 'Cortez', email: 'Lautycortez725@gmail.com', password: '1234', dni: '3425458005', userType: 'Administrador' },
    { id: 2, nombre: 'Alejo', apellido: 'Castelnovo', email: 'castelnovo12@gmail.com', password: '123', dni: '0987654321', userType: 'Administrador' }
  ];

  private usuarioLogueado: any = null;
  private usuarioLogueadoSubject = new BehaviorSubject<any>(null);

  constructor() {}

  login(email: string, password: string): Observable<boolean> {
    const usuario = this.usuarios.find(u => u.email === email && u.password === password);
    if (usuario) {
      this.usuarioLogueado = { ...usuario };
      this.usuarioLogueadoSubject.next(this.usuarioLogueado);
      console.log('Usuario autenticado:', this.usuarioLogueado);
      return of(true);
    }
    console.log('Autenticación fallida para:', email);
    return of(false);
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
}
