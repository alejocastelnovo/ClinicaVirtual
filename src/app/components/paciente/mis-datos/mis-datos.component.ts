import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { EspecialidadService } from '../../../services/especialidad.service';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.css']
})
export class MisDatosComponent implements OnInit {
  usuarioForm: FormGroup;
  editing: boolean = false;
  datos: any;
  coberturas: any[] = [];
  private snackBar = inject(MatSnackBar);
  loading: boolean | undefined;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private especialidadService: EspecialidadService
  ) {
    this.usuarioForm = this.fb.group({
      nombre: [{value: '', disabled: true}],
      apellido: [{value: '', disabled: true}],
      dni: [{value: '', disabled: true}],
      fecha_nacimiento: [{value: '', disabled: true}],
      email: [''],
      telefono: [''],
      password: [''],
      cobertura: ['']
    });
  }

  ngOnInit() {
    this.obtenerUsuario();
    this.cargarCoberturas();
  }

  obtenerUsuario() {
    const usuario = this.authService.getCurrentUser();
    if (usuario) {
      this.authService.obtenerUsuario(usuario.id).subscribe({
        next: (response) => {
          if (response.codigo === 200 && response.payload.length > 0) {
            this.datos = response.payload[0];
            this.usuarioForm.patchValue({
              nombre: this.datos.nombre,
              apellido: this.datos.apellido,
              dni: this.datos.dni,
              fecha_nacimiento: this.datos.fecha_nacimiento,
              email: this.datos.email,
              telefono: this.datos.telefono || '',
              cobertura: this.datos.id_cobertura
            });
          }
        },
        error: (error) => {
          this.openSnackBar('Error al cargar los datos del usuario');
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  cargarCoberturas() {
    this.especialidadService.obtenerCoberturas().subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.coberturas = response.payload;
        }
      },
      error: (error) => this.openSnackBar('Error al cargar las coberturas')
    });
  }


  guardar() {
    if (this.usuarioForm.valid) {
      const cambios = {
        id: this.datos.id,
        dni: this.datos.dni,
        apellido: this.datos.apellido,
        nombre: this.datos.nombre,
        fecha_nacimiento: this.datos.fecha_nacimiento,
        rol: this.datos.rol,
        email: this.usuarioForm.get('email')?.value,
        telefono: this.usuarioForm.get('telefono')?.value,
        password: this.usuarioForm.get('password')?.value || this.datos.password,
        id_cobertura: this.usuarioForm.get('cobertura')?.value
      };

      this.authService.actualizarUsuario(cambios).subscribe({
        next: (response) => {
          if (response.codigo === 200) {
            const usuarioActualizado = { 
              ...this.datos,
              email: cambios.email,
              telefono: cambios.telefono,
              id_cobertura: cambios.id_cobertura
            };
            localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
            this.openSnackBar('Cambios guardados con éxito');
            this.obtenerUsuario();
          }
        },
        error: (error) => {
          this.openSnackBar('Error al actualizar los datos');
        }
      });
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000
    });
  }
}


