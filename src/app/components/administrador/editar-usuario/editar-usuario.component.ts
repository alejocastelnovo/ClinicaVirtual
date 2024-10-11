import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    // Aquí deberías cargar los datos del usuario usando el ID
    // Por ejemplo: this.cargarUsuario(this.id);
  }

  onSubmit() {
    // Aquí deberías implementar la lógica para guardar los cambios del usuario
    console.log('Guardando usuario:', this.usuario);
    // Después de guardar, redirige a la lista de usuarios
    this.router.navigate(['/administrador/usuarios']);
  }

  onCancel() {
    // Redirige a la lista de usuarios sin guardar cambios
    this.router.navigate(['/administrador/usuarios']);
  }
}
