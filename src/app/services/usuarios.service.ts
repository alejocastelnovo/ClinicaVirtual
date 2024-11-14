import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) { 
  }

  obtenerUsuario(id: any, token: string ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': token
    });
    return this.http.get(`${this.apiUrl}/obtenerUsuario/${id}`, { headers });
  }

  obtenerMedicos(token: string): Observable<any> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': token
    });
    
    return this.http.get(`${this.apiUrl}/obtenerUsuarios`, { headers }).pipe(
        map((data: any) => {
            if (data.codigo === 200) {
                return data.payload.filter((usuario: any) => usuario.rol === 'medico');
            } else {
                throw new Error(data.mensaje);
            }
        })
    );
}

  crearUsuario(usuario: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': token
    });
    return this.http.post(`${this.apiUrl}/crearUsuario`, usuario, { headers });
  }
  
  obtenerUsuarios(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': token
    });    
      
    return this.http.get(`${this.apiUrl}/obtenerUsuarios`, { headers });
  }
  actualizarUsuario(id: any, body: any, token:string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': token
    });
      
    return this.http.put(`${this.apiUrl}/actualizarUsuario/${id}`, body, { headers });
  }
}

