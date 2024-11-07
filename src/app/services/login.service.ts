import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:4000/api';
  token : any = localStorage.getItem('jwt');
  constructor(private http: HttpClient) { }


  login(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/login`, body, { headers });
  }

  register(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
      
    return this.http.post(`${this.apiUrl}/crearUsuario`, body, { headers });
  }

}
