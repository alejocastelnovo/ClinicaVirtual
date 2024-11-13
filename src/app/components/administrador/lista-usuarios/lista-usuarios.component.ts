import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditarPacienteComponent } from '../editar-paciente/editar-paciente.component';


@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})

export class ListaUsuariosComponent implements OnInit{
  displayedColumns: string[] = ['nombre', 'apellido', 'tipousuario','acciones'];
  listaUsuarios: any[] = [];
  dataSource: any;
  token: any = localStorage.getItem('jwt');
  usuariosFiltrados: any;
  filtroSeleccionado: any;
  valorFiltro: any;

  constructor(private usuariosService: UsuariosService, 
    private dialog: MatDialog, 
    private router:Router,
    private snackBar: MatSnackBar
  ){}

  ngOnInit(){
    this.obtenerUsuario();
  }

  obtenerUsuario(){
    this.usuariosService.obtenerUsuarios(this.token).subscribe((data : any) =>{      
      console.log(data)
      if (data.codigo === 200 && data.payload.length > 0){
      this.listaUsuarios = data.payload
      console.log(this.listaUsuarios)
      this.dataSource=this.listaUsuarios
      }else if(data.codigo === -1){
        this.jwtExpirado();
      } 
      else {
        this.openSnackBar(data.mensaje);
      }
    })
  }

  editarUsuario(id: any){
    const dialogRef = this.dialog.open(EditarPacienteComponent, {
      width: '450px',
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.obtenerUsuario();
      }
    })
  }

  filtrarUsuarios() {
    if (this.filtroSeleccionado && this.valorFiltro) {
      this.usuariosFiltrados = this.listaUsuarios.filter(usuario => {
        return usuario[this.filtroSeleccionado]?.toLowerCase().includes(this.valorFiltro.toLowerCase());
      });
      this.dataSource = this.usuariosFiltrados;
    }
  }

  borrarFiltro() {
    this.dataSource = this.listaUsuarios;
    this.valorFiltro = '';
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