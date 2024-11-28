import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const expectedRoles = route.data['roles'] as Array<string>;
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    if (expectedRoles.includes(currentUser.rol)) {
      return true;
    }

    this.snackBar.open(
      'No tienes permisos para acceder a esta sección', 
      'Cerrar', 
      { duration: 3000 }
    );
    
    this.router.navigate(['/dashboard']);
    return false;
  }
}