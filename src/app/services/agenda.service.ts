import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token || ''
    });
  }

  obtenerAgenda(medicoId: number): Observable<any> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token || '',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    
    return this.http.get(`${this.apiUrl}/obtenerAgenda/${medicoId}`, { headers });
  }

  obtenerAgendasPorFecha(fecha: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token || ''
    });
    
    return this.http.get(`${this.apiUrl}/obtenerAgendasPorFecha/${fecha}`, { headers });
  }

  obtenerAgendaPorMedicoYFecha(medicoId: number, fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerAgendaPorMedicoYFecha`, { params: { id_medico: medicoId, fecha: fecha } });
  }

  crearAgenda(agenda: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crearAgenda`, agenda, {
      headers: this.getHeaders()
    });
  }

  modificarAgenda(id: number, agenda: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/modificarAgenda/${id}`, agenda, {
      headers: this.getHeaders()
    });
  }

  obtenerMedicosConTurnos(fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/medicos-turnos/${fecha}`, {
      headers: this.getHeaders()
    });
  }
} 