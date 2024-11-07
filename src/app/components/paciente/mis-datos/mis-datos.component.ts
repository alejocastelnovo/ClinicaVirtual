import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.css']
})
export class MisDatosComponent implements OnInit {
  usuarioForm: FormGroup;
  loading = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.usuarioForm = this.fb.group({
      nombre: [{ value: '', disabled: true }],
      apellido: [{ value: '', disabled: true }],
      dni: [{ value: '', disabled: true }],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{7}$')]],
      password: ['', [Validators.minLength(3)]],
      fecha_nacimiento: [{ value: '', disabled: true }]
    });
  }

  ngOnInit() {
    const usuario = this.authService.getCurrentUser();
    if (usuario) {
      this.usuarioForm.patchValue({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        dni: usuario.dni,
        email: usuario.email,
        telefono: usuario.telefono || '',
        fecha_nacimiento: usuario.fecha_nacimiento
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  guardarCambios() {
    if (this.usuarioForm.valid) {
      this.loading = true;
      const usuario = this.authService.getCurrentUser();
      const cambios = {
        id: usuario.id,
        dni: usuario.dni,
        apellido: usuario.apellido,
        nombre: usuario.nombre,
        fecha_nacimiento: usuario.fecha_nacimiento,
        rol: usuario.rol,
        email: this.usuarioForm.get('email')?.value,
        telefono: this.usuarioForm.get('telefono')?.value,
        password: this.usuarioForm.get('password')?.value || usuario.password
      };

      this.authService.actualizarUsuario(cambios).subscribe({
        next: (response) => {
          if (response.codigo === 200) {
            const usuarioActualizado = { ...usuario, ...cambios };
            localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
            this.mostrarMensaje('Datos actualizados correctamente');
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.mostrarError('Error al actualizar los datos');
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  private mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000
    });
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}

