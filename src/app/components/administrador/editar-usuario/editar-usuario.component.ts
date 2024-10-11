import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {
  usuario: any = {};
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.cargarUsuario(this.id);
  }

  cargarUsuario(id: number) {
    this.authService.getUsuarioPorId(id).subscribe(
      usuario => {
        this.usuario = usuario;
      },
      error => {
        console.error('Error al cargar el usuario:', error);
      }
    );
  }

  onSubmit() {
    this.authService.editarUsuario(this.id, this.usuario).subscribe(
      success => {
        if (success) {
          console.log('Usuario actualizado con éxito');
          this.router.navigate(['/administrador/gestion-usuarios']);
        } else {
          console.error('Error al actualizar el usuario');
        }
      },
      error => {
        console.error('Error al actualizar el usuario:', error);
      }
    );
  }

  onCancel() {
    this.router.navigate(['/administrador/gestion-usuarios']);
  }
}
