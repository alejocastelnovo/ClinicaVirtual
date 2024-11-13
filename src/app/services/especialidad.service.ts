import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private apiUrl = 'http://localhost:4000/api';  // La URL del backend
  constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('jwt');
        return new HttpHeaders({
      'Content-Type': 'application/json',
            'Authorization': token || ''
    });
  }

  obtenerEspecialidades(token:string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': token
    });
    return this.http.get(`${this.apiUrl}/obtenerEspecialidades`, { headers });
  }

  crearMedicoEspecialidad(body: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': token
    });
    return this.http.post(`${this.apiUrl}/crearMedicoEspecialidad`, body ,{ headers });
  }

  obtenerCobertura(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': token
    });
    return this.http.get(`${this.apiUrl}/obtenerCoberturas` ,{ headers });
  }

  obtenerMedicoPorEspecialidad(id_especialidad: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': token
    });
    return this.http.get(`${this.apiUrl}/obtenerMedicoPorEspecialidad/${id_especialidad}` ,{ headers });
  }
}

   