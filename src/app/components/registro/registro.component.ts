import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AppModule } from 'src/app/app.module';


@Component({
  selector: 'app-register',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    
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
    if (this.registerForm.valid) {
      this.authService.registrarUsuario(this.registerForm.value).subscribe(
        response => {
          console.log('Usuario registrado con éxito', response);
        },
        error => {
          console.error('Error al registrar usuario', error);
        }
      );
    }
  }

  // Método para manejar la cancelación
  onCancel(): void {
    this.registerForm.reset();
  }
}
