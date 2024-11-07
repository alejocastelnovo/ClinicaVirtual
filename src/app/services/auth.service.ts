import { JsonPipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
  ) { }

  isLoggedin(): boolean {
    return !!localStorage.getItem('jwt');
  }

  logout() {
    localStorage.removeItem('jwt');
  }

getCurrentUser(){
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;

}


}

