import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
            'Authorization': token || ''
        });
    }

    obtenerEspecialidades(): Observable<any> {
        return this.http.get(`${this.apiUrl}/especialidades`, { headers: this.getHeaders() });
    }

    obtenerCoberturas(): Observable<any> {
        return this.http.get(`${this.apiUrl}/especialidades/coberturas`, { headers: this.getHeaders() });
    }

    obtenerEspecialidadesMedico(idMedico: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/especialidades/medico/${idMedico}`, { headers: this.getHeaders() });
    }

    obtenerMedicosPorEspecialidad(idEspecialidad: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/especialidades/medicos/${idEspecialidad}`, { headers: this.getHeaders() });
    }
} 