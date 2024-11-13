import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../../services/turno.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgendaService } from 'src/app/services/agenda.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-turnos-programados',
  templateUrl: './turnos-programados.component.html',
  styleUrls: ['./turnos-programados.component.css']
})
export class TurnosProgramadosComponent{
  id: any;
  token: any;
  displayedColumns = ['fecha', 'hora_entrada', 'hora_salida'];
  horarios: FormGroup;
  agenda: any;
  hoy: Date = new Date();
  fecha = new Date().toISOString().split('T')[0];
  
  loading = false;
  fechaSeleccionada = new FormControl(new Date());

  constructor(
    private router: Router, 
    private snackBar: MatSnackBar, 
    private fb: FormBuilder, 
    private agendaService: AgendaService, 
    private dialog: MatDialog) {
    this.id = localStorage.getItem('id');
    this.token = localStorage.getItem('jwt');
    this.horarios = this.fb.group({
      fecha: [new Date(), Validators.required]
    });
    const hoy = new Date().toISOString();
    this.obtenerAgenda(hoy);
    this.horarios.get('fecha')?.valueChanges.subscribe((value) => {
      this.fecha = this.horarios.controls['fecha'].value.toISOString().split('T')[0]
    })
  }


  obtenerAgenda(fecha: any) {
    if (fecha === '') {
      fecha = this.horarios.controls['fecha'].value;
    }
    this.agendaService.obtenerAgenda(this.id).subscribe((data: any) => {
      if (data.codigo === 200 && data.payload.length > 0) {

        const fechaSeleccionada = new Date(this.horarios.controls['fecha'].value);

        let fechaFormatted = fechaSeleccionada.toISOString().split('T')[0];

        const payload = Array.isArray(data.payload) ? data.payload : Object.values(data.payload);

        this.agenda = payload.filter((horario: { fecha: any; }) => {
          const fechaHorario = new Date(horario.fecha).toISOString().split('T')[0];
          return fechaHorario === fechaFormatted;
        });
        console.log(this.agenda);
      } else if (data.codigo === -1) {
        this.jwtExpirado();
      } else {
        this.openSnackBar(data.mensaje);
      }
    })
  }
  jwtExpirado() {
    this.openSnackBar('Sesión expirada.');

    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1000);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
    });
  }
}
