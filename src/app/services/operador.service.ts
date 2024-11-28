import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperadorService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token || ''
    });
  }

  crearPaciente(paciente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crearUsuario`, paciente, 
      { headers: this.getHeaders() });
  }

  obtenerMedicosPorFecha(fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/medicos-turnos/${fecha}`, 
      { headers: this.getHeaders() });
  }

  editarAgendaMedico(idAgenda: number, agenda: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/modificarAgenda/${idAgenda}`, agenda,
      { headers: this.getHeaders() });
  }

  obtenerTurnosMedico(idMedico: number, fecha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/obtenerTurnosMedico`, 
      { id_medico: idMedico, fecha: fecha },
      { headers: this.getHeaders() });
  }
}