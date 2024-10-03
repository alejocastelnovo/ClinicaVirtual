import { Component } from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent {
  email: string = '';
  password: string = '';

  onSubmit() {

    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}