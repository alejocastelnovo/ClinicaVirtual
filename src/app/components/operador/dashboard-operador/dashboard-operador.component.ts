import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-dashboard-operador',
    templateUrl: './dashboard-operador.component.html',
    styleUrls: ['./dashboard-operador.component.css']
})
export class DashboardOperadorComponent {
    usuario: any;
    menuItems = [
        { 
            titulo: 'Agenda Médicos', 
            icono: 'calendar_today', 
            ruta: '/operador/agenda-medicos',
            descripcion: 'Gestionar agendas médicas'
        },
        { 
            titulo: 'Crear Paciente', 
            icono: 'person_add', 
            ruta: '/operador/crear-paciente',
            descripcion: 'Registrar nuevo paciente'
        },
        { 
            titulo: 'Lista de Médicos', 
            icono: 'people', 
            ruta: '/operador/lista-medicos',
            descripcion: 'Ver y gestionar médicos'
        },
        { 
            titulo: 'Asignar Turno', 
            icono: 'event_available', 
            ruta: '/operador/asignar-turno',
            descripcion: 'Gestionar turnos'
        }
    ];

    constructor(
        private router: Router,
        private authService: AuthService
    ) {
        this.usuario = this.authService.getCurrentUser();
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}