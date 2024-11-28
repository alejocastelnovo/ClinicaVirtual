import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { OperadorService } from '../../../services/operador.service';
import { EspecialidadService } from '../../../services/especialidad.service';

@Component({
  selector: 'app-crear-paciente',
  templateUrl: './crear-paciente.component.html',
  styleUrls: ['./crear-paciente.component.css']
})
export class CrearPacienteComponent implements OnInit {
  pacienteForm: FormGroup;
  coberturas: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private operadorService: OperadorService,
    private especialidadService: EspecialidadService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.pacienteForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      fecha_nacimiento: ['', Validators.required],
      id_cobertura: ['', Validators.required],
      password: ['123456', Validators.required] // Contraseña por defecto
    });
  }

  ngOnInit() {
    this.cargarCoberturas();
  }

  cargarCoberturas() {
    this.loading = true;
    this.especialidadService.obtenerCoberturas().subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.coberturas = response.payload;
        } else {
          this.mostrarError('Error al cargar las coberturas');
        }
      },
      error: (error) => this.mostrarError('Error al cargar las coberturas'),
      complete: () => this.loading = false
    });
  }

  onSubmit() {
    if (this.pacienteForm.valid) {
      this.loading = true;
      const pacienteData = {
        ...this.pacienteForm.value,
        rol: 'paciente'
      };

      this.operadorService.crearPaciente(pacienteData).subscribe({
        next: (response) => {
          if (response.codigo === 200) {
            this.mostrarMensaje('Paciente creado exitosamente');
            this.router.navigate(['/operador/dashboard']);
          } else {
            this.mostrarError(response.mensaje || 'Error al crear el paciente');
          }
        },
        error: (error) => this.mostrarError('Error al crear el paciente'),
        complete: () => this.loading = false
      });
    }
  }

  private mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
