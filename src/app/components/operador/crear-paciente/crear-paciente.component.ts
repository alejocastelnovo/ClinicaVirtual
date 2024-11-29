import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OperadorService } from '../../../services/operador.service';
import { EspecialidadService } from '../../../services/especialidad.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-crear-paciente',
  templateUrl: './crear-paciente.component.html',
  styleUrls: ['./crear-paciente.component.css']
})
export class CrearPacienteComponent implements OnInit {
  pacienteForm: FormGroup;
  loading = false;
  coberturas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private operadorService: OperadorService,
    private especialidadService: EspecialidadService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.pacienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      id_cobertura: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarCoberturas();
  }

  cargarCoberturas() {
    this.loading = true;
    this.especialidadService.obtenerCoberturas().subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          this.coberturas = response.payload;
        } else {
          this.mostrarError('Error al cargar coberturas');
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.mostrarError('Error al cargar coberturas');
      },
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
            this.snackBar.open('Paciente creado exitosamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/operador/dashboard']);
          } else {
            this.mostrarError(response.mensaje || 'Error al crear paciente');
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.mostrarError('Error al crear paciente');
          this.loading = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/operador/dashboard']);
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }
}
