import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TurnoService } from 'src/app/services/turno.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { AgendaService } from 'src/app/services/agenda.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.component.html',
  styleUrls: ['./nuevo-turno.component.css']
})
export class NuevoTurnoComponent {
  turnoForm: FormGroup;
  loading: boolean = false;
  token: any = localStorage.getItem('jwt');
  id: any = localStorage.getItem('id');
  rol: any = localStorage.getItem('rol');
  profesionales: any[] = [];
  especialidades: any[] = [];
  coberturas: any[] = [];
  agendaHoras: any[] = [];
 /*  horas: string[] = [];
  minutos: string[] = []; */

  constructor(private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private turnosService: TurnoService,
    private usuariosService: UsuariosService,
    private especialidadesService: EspecialidadService,
    private agendaService: AgendaService) {
    this.turnoForm = this.fb.group({
      cobertura: ['', Validators.required],
      especialidad: ['', Validators.required],
      profesional: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      minutos: ['', Validators.required],
      razon: ['', Validators.required],
      agenda: ['', Validators.required],
    });
    this.obtenerDatosIniciales();
  }

  obtenerDatosIniciales() {
    this.obtenerEspecialidades();
    this.obtenerCoberturas();
    this.obtenerProfesionales();
  }

  ngOnInit() {
    this.obtenerAgendas();
    this.obtenerProfesionales();
}

obtenerAgendas() {
  this.agendaService.obtenerAgenda(this.id).subscribe((data: any) => {
      console.log('Datos de la API:', data);
      if (data.codigo === 200) {
          this.agendaHoras = data.payload;
      } else {
          this.snackBar.open(data.mensaje, 'Cerrar', { duration: 3000 });
      }
  });
}
  obtenerEspecialidades() {
    this.especialidadesService.obtenerEspecialidades(this.token).subscribe((data: any) => {
      if (data.codigo === 200) {
        this.especialidades = data.payload;
      } else {
        this.snackBar.open(data.mensaje, 'Cerrar', { duration: 3000 });
      }
    });
  }

  obtenerProfesionales() {
    this.usuariosService.obtenerMedicos(this.token).subscribe((data: any) => {
      this.profesionales = data;
    }, (error) => {
      this.snackBar.open(error.message, 'Cerrar', { duration: 3000 });
    });
  }

  onMedicoChange(medicoId: number) {
    this.agendaService.obtenerAgenda(medicoId).subscribe((data: any) => {
      console.log('Datos de la API de agendas:', data);
      if (data.codigo === 200) {
        this.agendaHoras = data.payload; // Asigna las agendas del médico seleccionado
      } else {
        this.snackBar.open(data.mensaje, 'Cerrar', { duration: 3000 });
      }
    });
  }

  obtenerCoberturas() {
    this.especialidadesService.obtenerCobertura(this.token).subscribe((data: any) => {
      if (data.codigo === 200) {
        this.coberturas = data.payload;
      } else {
        this.snackBar.open(data.mensaje, 'Cerrar', { duration: 3000 });
      }
    });
  }

/*   generarHoras() {
    const horas = [];
    for (let i = 8; i <= 20; i++) { 
      horas.push(i.toString().padStart(2, '0') + ':00');
    }
    return horas;
  }

  generarMinutos() {
    return ['00', '15', '30', '45']; // Minutos disponibles
  } */
  /* obtenerAgenda(id: number) {
    this.agendaService.obtenerAgenda(id).subscribe((data: any) => {
      if (data.codigo === 200 && data.payload.length > 0) {
        this.agenda = data.payload.map((item: any) => new Date(item.fecha));
        let fecha = new Date(this.turnoForm.controls['fecha'].value).toISOString();
        this.agendaHoras = data.payload.filter((obj: { fecha: any; }) => obj.fecha.startsWith(fecha));
        if (this.agendaHoras) {
          this.horas = [];
          for (let i = 0; i < this.agendaHoras.length; i++) {
            let horasEntre = this.obtenerHorasEntre(this.agendaHoras[i].hora_entrada, this.agendaHoras[i].hora_salida);
            this.numArray = i;
            this.horas = this.horas.concat(horasEntre).sort();
          }
        }
      }
    });
  }
 */
  
  guardarTurno() {
    this.loading = true;
    let body = this.crearBodyTurno();

    // Verificar si el cuerpo del turno es válido
    if (!body) {
      this.loading = false;
      return; // Si el cuerpo es nulo, no continuar
    }

    // Asignar el turno
    this.turnosService.asignarTurno(body).subscribe((data: any) => {
      this.loading = false;
      if (data.codigo === 200) {
        this.snackBar.open('Turno confirmado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      } else {
        this.snackBar.open(data.mensaje, 'Cerrar', { duration: 3000 });
      }
    }, error => {
      this.loading = false;
      this.snackBar.open('Error al asignar el turno', 'Cerrar', { duration: 3000 });
    });
  }
  crearBodyTurno() {
    // Obtener el ID de la agenda seleccionada desde el formulario
    const idAgendaSeleccionada = this.turnoForm.controls['agenda'].value;
  
    // Verificar que el ID de la agenda seleccionada sea válido
    if (idAgendaSeleccionada) {
      // Buscar la agenda seleccionada en agendaHoras
      const agendaSeleccionada = this.agendaHoras.find(agenda => agenda.id === idAgendaSeleccionada);
  
      // Verificar que se encontró la agenda
      if (agendaSeleccionada) {
        return {
          id_agenda: idAgendaSeleccionada, // Usar el ID de la agenda seleccionada
          fecha: this.turnoForm.controls['fecha'].value,
          hora: agendaSeleccionada.hora_entrada, // Usar la hora de inicio de la agenda
          id_paciente: this.id,
          id_cobertura: this.turnoForm.controls['cobertura'].value,
          nota: String(this.turnoForm.controls['razon'].value)
        };
      } else {
        this.snackBar.open('No se ha encontrado la agenda seleccionada', 'Cerrar', { duration: 3000 });
        return null;
      }
    } else {
      this.snackBar.open('No se ha seleccionado una agenda válida', 'Cerrar', { duration: 3000 });
      return null;
    }
}
}