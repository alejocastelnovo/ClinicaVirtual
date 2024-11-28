import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-dashboard-operador',
    templateUrl: './dashboard-operador.component.html',
    styleUrls: ['./dashboard-operador.component.css']
})
export class DashboardOperadorComponent implements OnInit {
    usuario: any;

    constructor(
        private router: Router,
        private authService: AuthService
    ) {
        this.usuario = this.authService.getCurrentUser();
    }

    ngOnInit() {
        if (!this.authService.isLoggedIn() || this.authService.getCurrentUser()?.rol !== 'operador') {
            this.router.navigate(['/login']);
        }
    }

    navegarA(ruta: string) {
        if (ruta === '/operador/dashboard-operador') {
            this.router.navigate(['/operador/dashboard']);
        } else {
            this.router.navigate([ruta]);
        }
    }
}