import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  constructor(private router: Router) {}

  email: string = '';
  password: string = '';

  onSubmit() {

    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }

  onRegister() {
    console.log('Función de registro llamada');
    // Navegar a la página de registro
    this.router.navigate(['/registro']);
  }
}