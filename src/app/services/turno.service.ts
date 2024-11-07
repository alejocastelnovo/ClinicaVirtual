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
    return new HttpHeaders().set('Authorization', `${token}`);
  }

  obtenerTurnosPaciente(idPaciente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerTurnoPaciente/${idPaciente}`, 
      { headers: this.getHeaders() });
  }

  obtenerTurnosMedico(idMedico: number, fecha: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/obtenerTurnosMedico`, 
      { id_medico: idMedico, fecha: fecha },
      { headers: this.getHeaders() });
  }

  asignarTurno(turno: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/asignarTurnoPaciente`, turno,
      { headers: this.getHeaders() });
  }

  actualizarTurno(id: number, turno: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizarTurnoPaciente/${id}`, turno,
      { headers: this.getHeaders() });
  }

  eliminarTurno(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminarTurnoPaciente/${id}`,
      { headers: this.getHeaders() });
  }
}
