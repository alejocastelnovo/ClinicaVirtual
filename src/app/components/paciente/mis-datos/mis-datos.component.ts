import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.css']
})
export class MisDatosComponent implements OnInit {
  usuarioForm: FormGroup;
  usuario: any;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.usuario = this.authService.getUsuarioLogueado();
    if (this.usuario) {
      this.usuarioForm.patchValue({
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        dni: this.usuario.dni,
        email: this.usuario.email,
        password: this.usuario.password,
        fechaNacimiento: this.usuario.fechaNacimiento || ''
      });
    }
  }

  guardarCambios() {
    if (this.usuarioForm.valid) {
      const cambios = this.usuarioForm.value;
      if (this.authService.actualizarDatosUsuario(this.usuario.id, cambios)) {
        alert('Cambios guardados con éxito');
        this.router.navigate(['/dashboard']);
      } else {
        alert('Error al guardar los cambios');
      }
    }
  }
}
