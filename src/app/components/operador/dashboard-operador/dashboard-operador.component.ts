import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgendaService } from '../../../services/agenda.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
    selector: 'app-dashboard-operador',
    templateUrl: './dashboard-operador.component.html',
    styleUrls: ['./dashboard-operador.component.css']
})
export class DashboardOperadorComponent implements OnInit {

    constructor(
        public router: Router,
        private authService: AuthService
    ) { }

    ngOnInit() {
        if (!this.authService.isLoggedIn() || this.authService.getCurrentUser()?.rol !== 'operador') {
            this.router.navigate(['/login']);
        }
    }
}