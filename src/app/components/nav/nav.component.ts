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
    userImagePath: string = 'assets/images/usuario.png';

    constructor(
        private router: Router,
        public authService: AuthService
    ) { }

    ngOnInit() {
        this.authService.getUserObservable().subscribe(usuarioLogueado => {
            if (usuarioLogueado) {
                this.userName = `${usuarioLogueado.nombre} ${usuarioLogueado.apellido}`;
                this.userType = usuarioLogueado.rol;
            } else {
                this.userName = null;
                this.userType = null;
            }
        });
    }

    logout() {
        this.authService.logout();
        this.authService.isLoggedIn();
        this.router.navigate(['/home']);
    }

    navigateToHome() {
        this.router.navigate(['/dashboard']);
    }
} 