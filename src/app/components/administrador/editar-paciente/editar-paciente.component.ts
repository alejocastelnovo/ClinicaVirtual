import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-editar-paciente',
  templateUrl: './editar-paciente.component.html',
  styleUrls: ['./editar-paciente.component.css']
})
export class EditarPacienteComponent implements OnInit {
  editarUsuarioForm: FormGroup;
  datos: any;
  titulo: any = 'Editar Paciente'
  token: any = localStorage.getItem('jwt');
  rol: any = localStorage.getItem('rol');
  especialidades: any;
  mostrarEspecialidades: any;
  hoy: Date = new Date();
  private _snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder, private especialidadesService: EspecialidadService, private dialogRef: MatDialogRef<EditarPacienteComponent>, private usuarioService: UsuariosService, @Inject(MAT_DIALOG_DATA) public data: { id: any }, private router: Router) {
    this.editarUsuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      usuario: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', Validators.required],
      telefono: ['', Validators.required],
      fechanac: ['', Validators.required],
      tipo_usuario: ['', Validators.required],
      contrasenia: ['', Validators.required],
      especialidad: ['']
    });

    this.editarUsuarioForm.get('tipo_usuario')?.valueChanges.subscribe(value => {
      if (value === 'medico') {
        this.editarUsuarioForm.controls['especialidad'].setValidators(Validators.required);
        this.mostrarEspecialidades = true;
        this.obtenerEspecialidades();
      } else {
        this.mostrarEspecialidades = false;
        this.editarUsuarioForm.controls['especialidad'].clearValidators()
        this.editarUsuarioForm.get('especialidad')?.reset();
      }
    });
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
    if (this.rol === 'administrador') {
      this.titulo = 'Editar Usuario'
    }
  }

  obtenerEspecialidades() {
    this.especialidadesService.obtenerEspecialidades(this.token).subscribe((data: any) => {
      if (data.codigo === 200 && data.payload.length > 0) {
        this.especialidades = data.payload;
      } else if (data.codigo === -1) {
        this.jwtExpirado()
      } else {
        this.openSnackBar(data.mensaje)
      }
    })
  }

  obtenerUsuarios() {
    this.usuarioService.obtenerUsuario(this.data.id, this.token).subscribe((data: any) => {
      if (data.codigo === 200 && data.payload.length > 0) {
        this.datos = data.payload[0];
        this.editarUsuarioForm.controls['nombre'].setValue(this.datos.nombre);
        this.editarUsuarioForm.controls['apellido'].setValue(this.datos.apellido);
        this.editarUsuarioForm.controls['usuario'].setValue(this.datos.usuario);
        this.editarUsuarioForm.controls['dni'].setValue(this.datos.dni);
        this.editarUsuarioForm.controls['email'].setValue(this.datos.email);
        this.editarUsuarioForm.controls['telefono'].setValue(this.datos.telefono);
        this.editarUsuarioForm.controls['fechanac'].setValue(this.datos.fecha_nacimiento);
        this.editarUsuarioForm.controls['tipo_usuario'].setValue(this.datos.rol);
        this.editarUsuarioForm.controls['contrasenia'].setValue(this.datos.password);
        if (this.datos.rol === 'medico') {
          this.especialidadesService.obtenerEspecialidades(this.token).subscribe((data: any) => {
            this.editarUsuarioForm.controls['especialidad'].setValue(data.payload[0].id_especialidad)
          })
        }
        this.editarUsuarioForm.enable();
      } else if (data.codigo === -1) {
        this.jwtExpirado();
      } else {
        this.openSnackBar(data.mensaje);
      }
    })
  }

  guardar() {
    let body = {
      nombre: this.editarUsuarioForm.controls['nombre'].value,
      apellido: this.editarUsuarioForm.controls['apellido'].value,
      usuario: this.editarUsuarioForm.controls['usuario'].value,
      dni: this.editarUsuarioForm.controls['dni'].value,
      email: this.editarUsuarioForm.controls['email'].value,
      telefono: this.editarUsuarioForm.controls['telefono'].value,
      fecha_nacimiento: this.editarUsuarioForm.controls['fechanac'].value,
      rol: this.editarUsuarioForm.controls['tipo_usuario'].value,
      password: this.editarUsuarioForm.controls['contrasenia'].value,
    }

    let medicoEspecialidadBody = {
      id_medico: this.datos.id,
      id_especialidad: this.editarUsuarioForm.controls['especialidad'].value
    };

    this.especialidadesService.crearMedicoEspecialidad(medicoEspecialidadBody, this.token).subscribe((data: any) => {
      if (data.codigo === 200) {
        this.dialogRef.close(this.editarUsuarioForm.value);
        this.openSnackBar('Registro exitoso');
      } else {
        this.openSnackBar('Error al guardar la especialidad');
      }
    });

    this.usuarioService.actualizarUsuario(this.data.id, body, this.token).subscribe((data: any) => {
      if (data.codigo === 200) {
        this.openSnackBar('Cambios guardados con exito');
        this.dialogRef.close(true);
      } else if (data.codigo === -1) {
        this.jwtExpirado();
      } else {
        this.openSnackBar('No se pudo guardar los cambios correctamente');
      }
    })
  }

  onCancel() {
    this.dialogRef.close(true);
  }

  jwtExpirado() {
    this.openSnackBar('Sesión expirada.');

    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1000);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 5000,
    });
  }
}