import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuarios.service';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule,FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  @ViewChild('inputNombre') inputNombre!: ElementRef;
  @ViewChild('inputApellido') inputApellido!: ElementRef;
  @ViewChild('inputUsername') inputUsername!: ElementRef;
  @ViewChild('inputCorreo') inputCorreo!: ElementRef;

user: string = JSON.parse(localStorage.getItem('currentUser') || '{}').username;

usuario: { [key: string]: string } = {
  nombre: '',
  apellido: '',
  username: '',
  correo: ''
};

usuarioCopia: { [key: string]: string } = {
  nombre: '',
  apellido: '',
  username: '',
  correo: ''
};

controlExistencia: { [key: string]: boolean } = {
  username: false,
  correo: false,
};


constructor(private usuarioService: UsuarioService,) {
  this.usuarioService.getUsuario(this.user).subscribe((data: any) => {
    this.usuario['nombre'] = data.nombre;
    this.usuario['apellido'] = data.apellido;
    this.usuario['username'] = data.username;
    this.usuario['correo'] = data.correo;
    this.usuarioCopia = { ...this.usuario };
  });
}

editandoCampo: { [key: string]: boolean }= {
  nombre: false,
  apellido: false,
  username: false,
  correo: false
};

editarCampo(campo: string) {
  this.editandoCampo[campo] = true;
  this.controlExistencia[campo] = false;
  switch (campo) {
    case 'nombre':     
          setTimeout(() => {
                this.inputNombre.nativeElement.focus();
              }, 0);
      break;
    case 'apellido':
          setTimeout(() => {
                this.inputApellido.nativeElement.focus();
              }, 0);
      break;

    case 'username':
          setTimeout(() => {
                this.inputUsername.nativeElement.focus();
              }, 0);
      break;

    case 'correo':
          setTimeout(() => {
                this.inputCorreo.nativeElement.focus();
              }, 0);
      break;
    default:
      console.error('Campo no reconocido:', campo);

}
}

guardarCampo(campo: string) {
 
  this.usuarioService.actualizarUsuario(this.user,campo, this.usuario[campo]).subscribe(response => {
    
    if( campo === 'username'){
          
    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    user.username = this.usuario[campo];

    localStorage.setItem('currentUser', JSON.stringify(user));

      this.user = this.usuario[campo];
    }else if (campo === 'correo') {
      let user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    user.email = this.usuario[campo];

    localStorage.setItem('currentUser', JSON.stringify(user));
      }
      this.usuarioCopia = { ...this.usuario};

  }, error => {
   
    this.controlExistencia[campo] = true;
  } 
  );


  this.editandoCampo[campo] = false;

}


}
