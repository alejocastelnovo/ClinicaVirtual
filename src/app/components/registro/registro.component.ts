import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      dni: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.registerForm.valid) {
      const nuevoUsuario = {
        ...this.registerForm.value,
        rol: 'Paciente',
        telefono: ''
      };

      this.authService.registrarUsuario(nuevoUsuario).subscribe(
        (response) => {
          this.snackBar.open('Registro exitoso. Por favor, inicie sesión.', 'Cerrar', {
            duration: 5000,
          });
          this.router.navigate(['/login']);
        },
        (error) => {
          this.snackBar.open('Error al registrar usuario. Intente nuevamente.', 'Cerrar', {
            duration: 5000,
          });
        }
      );
    }
  }

  onCancel() {
    this.router.navigate(['/home']);
  }
}
