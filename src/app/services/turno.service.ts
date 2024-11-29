import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token || ''
    });
  }

  obtenerTurnosPaciente(idPaciente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerTurnoPaciente/${idPaciente}`, {
      headers: this.getHeaders()
    });
  }

  obtenerTurnosMedico(idMedico: number, fecha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/obtenerTurnosMedico`, 
      { id_medico: idMedico, fecha: fecha },
      { headers: this.getHeaders() }
    );
  }

  asignarTurno(turno: any): Observable<any> {
    // Validar que todos los campos requeridos estén presentes
    if (!turno.id_agenda || !turno.id_paciente || !turno.id_cobertura || !turno.fecha || !turno.hora) {
      throw new Error('Faltan campos requeridos para crear el turno');
    }
    
    // Asegurarse de que los IDs sean números
    const turnoValidado = {
      ...turno,
      id_agenda: Number(turno.id_agenda),
      id_paciente: Number(turno.id_paciente),
      id_cobertura: Number(turno.id_cobertura)
    };

    return this.http.post(`${this.apiUrl}/asignarTurnoPaciente`, turnoValidado, {
      headers: this.getHeaders()
    });
  }

  eliminarTurno(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminarTurnoPaciente/${id}`, {
      headers: this.getHeaders()
    });
  }
}
