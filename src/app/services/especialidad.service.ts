import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EspecialidadService {
    private apiUrl = 'http://localhost:4000/api';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('jwt');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        });
    }

    obtenerEspecialidades(): Observable<any> {
        return this.http.get(`${this.apiUrl}/obtenerEspecialidades`, {
          headers: this.getHeaders()
        }).pipe(
          tap(response => console.log('Respuesta especialidades:', response)),
          catchError(error => {
            console.error('Error al obtener especialidades:', error);
            throw error;
          })
        );
      }

    obtenerEspecialidadesMedico(idMedico: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/obtenerEspecialidadesMedico/${idMedico}`, { headers: this.getHeaders() });
    }

    obtenerMedicoPorEspecialidad(idEspecialidad: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/obtenerMedicoPorEspecialidad/${idEspecialidad}`, {
          headers: this.getHeaders()
        });
      }
    crearMedicoEspecialidad(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/crearMedicoEspecialidad`, data, { headers: this.getHeaders() });
    }
    obtenerCobertura(): Observable<any> {
        return this.http.get(`${this.apiUrl}/obtenerCoberturas`, {
          headers: this.getHeaders()
        });
      }

    obtenerCoberturas(): Observable<any> {
        return this.http.get(`${this.apiUrl}/obtenerCoberturas`, { headers: this.getHeaders() });
    }
} 