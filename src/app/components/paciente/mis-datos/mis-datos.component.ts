import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.css']
})
export class MisDatosComponent implements OnInit {
  usuarioForm: FormGroup;
  loading = false;
  id = localStorage.getItem('id');
  datos: any;
  editing: boolean = false;
  token: any;


  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private usuarioService: UsuariosService
  ) {
    this.usuarioForm = this.fb.group({
      nombre: [''],
      apellido: [''],
      dni: [ ''],
      email: [''],
      telefono: [''],
      password: [''],
      fecha_nacimiento: ['']
    });

    this.token = localStorage.getItem('jwt')
  }

  ngOnInit():void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.usuarioService.obtenerUsuario(this.id, this.token).subscribe((data: any) => {
      if (data.codigo === 200 && data.payload.length > 0) {
        this.datos = data.payload[0];
        this.usuarioForm.controls['nombre'].setValue(this.datos.nombre);
        this.usuarioForm.controls['apellido'].setValue(this.datos.apellido);
        this.usuarioForm.controls['dni'].setValue(this.datos.dni);
        this.usuarioForm.controls['email'].setValue(this.datos.email);
        this.usuarioForm.controls['telefono'].setValue(this.datos.telefono);
        this.usuarioForm.controls['password'].setValue(this.datos.password);
        this.usuarioForm.controls['correo'].setValue(this.datos.email);
        this.usuarioForm.disable();
      } else if (data.codigo === -1) {
        this.jwtExpirado();
      } else {
        this.openSnackBar(data.mensaje);
      }
    })
  }

  guardarCambios() {
    let body = {
      dni: this.datos.dni,
      apellido: this.datos.apellido,
      nombre: this.datos.nombre,
      fecha_nacimiento: this.datos.fecha_nacimiento,
      password: this.usuarioForm.controls['password'].value,
      rol: this.datos.rol,
      email: this.usuarioForm.controls['email'].value,
      telefono: this.usuarioForm.controls['telefono'].value
    }
    this.usuarioService.actualizarUsuario(this.id, body, this.token).subscribe((data: any) => {
      if (data.codigo === 200) {
        this.editing = false;
        this.openSnackBar('Cambios guardados con exito');
        this.usuarioForm.controls['correo'].disable()
        this.usuarioForm.controls['contrasenia'].disable()
        this.usuarioForm.controls['telefono'].disable()
      } else if (data.codigo === -1) {
        this.jwtExpirado();
      } else {
        this.openSnackBar(data.mensaje)
      }
    })
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


  jwtExpirado() {
    this.openSnackBar('Sesión expirada.');

    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 1000);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
    });
  }
}
