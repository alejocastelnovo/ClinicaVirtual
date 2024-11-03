import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    userName: string | null = null;
    userType: string | null = null;
    userTypeShort: string | null = null;
    userImagePath: string = 'assets/images/usuario.png';

    constructor(
        private router: Router,
        public authService: AuthService
    ) { }

    ngOnInit() {
        const usuarioLogueado = this.authService.getCurrentUser();
        if (usuarioLogueado) {
            this.userName = `${usuarioLogueado.nombre} ${usuarioLogueado.apellido}`;
            this.userType = usuarioLogueado.rol;
            this.userTypeShort = this.getUserTypeShort(usuarioLogueado.rol);
        }
    }

    getUserTypeShort(userType: string | null): string {
        switch (userType) {
            case 'administrador': return 'A';
            case 'operador': return 'O';
            case 'medico': return 'M';
            case 'paciente': return 'P';
            default: return '?';
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/home']);
    }

    navigateToHome() {
        this.router.navigate(['/dashboard']);
    }
} 