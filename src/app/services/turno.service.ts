import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private apiUrl = 'http://localhost:4000/api'; // URL de tu backend

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token || ''
    });
  }

  obtenerTurnosPaciente(idPaciente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/turno/${idPaciente}`, { headers: this.getHeaders() });
  }

  obtenerTurnosMedico(idMedico: number, fecha: string): Observable<any> {
    const body = { id_medico: idMedico, fecha: fecha };
    return this.http.post(`${this.apiUrl}/turno/medico`, body, { headers: this.getHeaders() });
  }

  asignarTurno(turnoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/turno`, turnoData, { headers: this.getHeaders() });
  }

  actualizarTurno(id: number, turnoData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/turno/${id}`, turnoData, { headers: this.getHeaders() });
  }

  eliminarTurno(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/turno/${id}`, { headers: this.getHeaders() });
  }
}
