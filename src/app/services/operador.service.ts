import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

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

  /* obtenerMedicosPorFecha(fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerTurnosMedico/${fecha}`, 
      { headers: this.getHeaders() });
  } */

      obtenerAgendasDisponibles(): Observable<any> {
        return this.http.get(`${this.apiUrl}/obtenerAgendasDisponibles`, { headers: this.getHeaders() });
      }
    
      obtenerAgenda(id_medico: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerAgenda/${id_medico}`, { headers: this.getHeaders() });
  }

  obtenerMedicos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerUsuarios`, {
      headers: this.getHeaders()
    }).pipe(
      map((response: any) => {
        if (response.codigo === 200) {
          // Filtrar usuarios con rol 'medico'
          const medicos = response.payload.filter((usuario: any) => usuario.rol === 'medico');
          return {
            codigo: 200,
            payload: medicos
          };
        } else {
          return response;
        }
      })
    );
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

  obtenerPacientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerUsuarios`, {
      headers: this.getHeaders()
    });
  }

  obtenerPacientesDia(fecha: string): Observable<any> {
    let params = new HttpParams().set('fecha', fecha);
    return this.http.get(`${this.apiUrl}/obtenerPacientesDia`, { params });
  }

  obtenerTurnosPaciente(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerTurnoPaciente/${id}`, { headers: this.getHeaders() });
  }


  obtenerUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerUsuario/${id}`, {
        headers: this.getHeaders()
    });
}
  
}