import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AgendaService } from '../../../services/agenda.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

interface MedicoTurnos {
    id: number;
    nombre: string;
    especialidad: string;
    hora_entrada: string;
    hora_salida: string;
}

@Component({
    selector: 'app-lista-medicos',
    templateUrl: './lista-medicos.component.html',
    styleUrls: ['./lista-medicos.component.css']
})
export class ListaMedicosComponent implements OnInit {
    fechaSeleccionada = new FormControl(new Date());
    medicos: MedicoTurnos[] = [];
    loading = false;
    displayedColumns: string[] = ['nombre', 'especialidad', 'horario', 'acciones'];

    constructor(
        private agendaService: AgendaService,
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    ngOnInit() {
        if (!this.authService.isLoggedIn() || this.authService.getCurrentUser()?.rol !== 'operador') {
            this.router.navigate(['/login']);
            return;
        }
        this.cargarMedicos();
    }

    onFechaChange() {
        this.cargarMedicos();
    }

    cargarMedicos() {
        this.loading = true;
        const fecha = this.formatearFechaParaAPI(this.fechaSeleccionada.value!);

        this.agendaService.obtenerMedicosConTurnos(fecha).subscribe({
            next: (response: any) => {
                if (response.codigo === 200) {
                    this.medicos = response.payload;
                } else {
                    this.mostrarError('Error al cargar los médicos');
                }
            },
            error: (error: any) => {
                console.error('Error:', error);
                this.mostrarError('Error al cargar los médicos');
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    editarAgenda(medicoId: number) {
        this.router.navigate(['/operador/editar-agenda', medicoId]);
    }

    verTurnos(medicoId: number) {
        this.router.navigate(['/operador/ver-turnos', medicoId]);
    }

    formatearFechaParaAPI(fecha: Date): string {
        return fecha.toISOString().split('T')[0];
    }

    private mostrarError(mensaje: string) {
        this.snackBar.open(mensaje, 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
        });
    }
}