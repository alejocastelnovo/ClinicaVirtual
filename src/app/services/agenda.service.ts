import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token || ''
    });
  }

  obtenerAgenda(idMedico: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerAgenda/${idMedico}`, 
      { headers: this.getHeaders() });
  }

  crearAgenda(agenda: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crearAgenda`, agenda,
      { headers: this.getHeaders() });
  }

  modificarAgenda(id: number, agenda: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/modificarAgenda/${id}`, agenda,
      { headers: this.getHeaders() });
  }
} 