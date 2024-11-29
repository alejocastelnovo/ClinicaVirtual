import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsuariosService {

    private apiUrl = 'http://localhost:4000/api';

    constructor(private http: HttpClient) {
    }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('jwt');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token || ''
        });
    }

    obtenerUsuario(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/obtenerUsuario/${id}`, {
            headers: this.getHeaders()
        });
    }

    actualizarUsuario(id: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/actualizarUsuario/${id}`, data, {
            headers: this.getHeaders()
        });
    }

    obtenerUsuarios(token: string | null): Observable<any> {
        return this.http.get(`${this.apiUrl}/obtenerUsuarios`, {
            headers: this.getHeaders()
        });
    }

    obtenerMedicos(): Observable<any> {
        return this.http.get(`${this.apiUrl}/obtenerUsuarios`, {
            headers: this.getHeaders(),
            params: { rol: 'medico' }
        });
    }

    crearUsuario(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/crearUsuario`, userData, {
            headers: this.getHeaders()
        });
    }

}
