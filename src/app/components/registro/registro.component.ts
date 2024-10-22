import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AppModule } from 'src/app/app.module';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,) {
    
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      dni: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    
    
  
  
  }

  onCancel(): void {
    this.registerForm.reset();
    this.router.navigate(['/home']);
  }
}
