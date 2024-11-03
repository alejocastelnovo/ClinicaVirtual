import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token || ''
    });
  }

  obtenerTurnosPaciente(idPaciente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerTurnoPaciente/${idPaciente}`, 
      { headers: this.getHeaders() });
  }

  obtenerTurnosMedico(idMedico: number, fecha: string): Observable<any> {
    const body = { id_medico: idMedico, fecha: fecha };
    return this.http.post(`${this.apiUrl}/obtenerTurnosMedico`, body, 
      { headers: this.getHeaders() });
  }

  asignarTurno(turnoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/asignarTurnoPaciente`, turnoData, 
      { headers: this.getHeaders() });
  }

  actualizarTurno(id: number, turnoData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizarTurnoPaciente/${id}`, turnoData, 
      { headers: this.getHeaders() });
  }

  eliminarTurno(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminarTurnoPaciente/${id}`, 
      { headers: this.getHeaders() });
  }
}
