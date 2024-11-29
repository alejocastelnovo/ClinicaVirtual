import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private usuarioService: UsuariosService
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tipo_usuario: ['', Validators.required],
      contrasenia: ['', Validators.required],
      dni: ['', Validators.required],
      telefono: ['', Validators.required],
      fechanac: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  private formatearFecha(fecha: Date): string {
    if (!fecha) return '';
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    if (this.usuarioForm.valid) {
      this.loading = true;
      const formData = this.usuarioForm.value;
      
      const userData = {
        dni: formData.dni,
        nombre: formData.nombre,
        apellido: formData.apellido,
        fecha_nacimiento: this.formatearFecha(formData.fechanac),
        email: formData.email,
        password: formData.contrasenia,
        rol: this.formatearRol(formData.tipo_usuario),
        telefono: formData.telefono
      };

      console.log('Datos formateados a enviar:', userData);

      this.usuarioService.crearUsuario(userData).subscribe({
        next: async (response: any) => {
          if (response.codigo === 200) {
            this.mostrarExito('Usuario creado exitosamente');
            this.router.navigate(['/administrador/lista-usuarios']);
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.mostrarError('Error al crear usuario: ' + (error.error?.message || 'Error desconocido'));
        },
        complete: () => this.loading = false
      });
    } else {
      this.mostrarError('Por favor, complete todos los campos requeridos');
    }
  }

  formatearRol(rol: string): string {
    if (!rol) return '';
    return rol.toLowerCase().replace(/[^a-z]/g, '');
  }

  onCancel(): void {
    this.router.navigate(['/administrador/lista-usuarios']);
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  private mostrarExito(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000
    });
  }
}

