import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuarios.service';
import Swal from 'sweetalert2';

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
@ViewChild('imagenPerfil') imagenPerfil!: ElementRef<HTMLImageElement>;

usuario: { [key: string]: string } = {
  nombre: '',
  apellido: '',
  username: '',
  correo: '',
  imagen: ''
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
    this.usuario['imagen'] = data.imagen;
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
    let campoElegido = campo;
    if(campoElegido == "username") campoElegido = "nombre de usuario";
    Swal.fire({
      title: `Seguro/a que quieres cambiar tu ${campoElegido}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
      showClass: {
        popup: 'animate__animated animate__fadeInDown animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOut animate__faster'
      }
    }).then((result) => {

      if (result.isConfirmed) {
       
            this.usuarioService.actualizarUsuario(this.user, campo, this.usuario[campo]).subscribe(response => {

          if (campo == 'username') {

            let user = JSON.parse(localStorage.getItem('currentUser') || '{}');

            user.username = this.usuario[campo];

            localStorage.setItem('currentUser', JSON.stringify(user));

            this.user = this.usuario[campo];

              } else if (campo == 'correo') {
                let user = JSON.parse(localStorage.getItem('currentUser') || '{}');

                user.email = this.usuario[campo];

                localStorage.setItem('currentUser', JSON.stringify(user));
              }
      this.usuarioCopia[campo] = this.usuario[campo];
       Swal.fire(`Tu ${campoElegido} a sido modificado.`, "", "success");
    }, error => {

      this.controlExistencia[campo] = true;
      this.usuario[campo] = this.usuarioCopia[campo];
    }
    );

      } else if (result.isDismissed) {
        this.usuario[campo] = this.usuarioCopia[campo];
        
      }
    });

    this.editandoCampo[campo] = false;

  }

  reset(campo: string){
      this.usuario[campo] = this.usuarioCopia[campo];
  }


  eliminarPerfil() {
    
    Swal.fire({
      title: '¿Estás seguro de que quieres eliminar tu perfil?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(this.user).subscribe(() => {
          Swal.fire('Perfil eliminado', 'Tu perfil ha sido eliminado correctamente.', 'success');
          localStorage.removeItem('currentUser');
          window.location.href = '/login'; // Redirigir al login
        }, error => {
          Swal.fire('Error', 'No se pudo eliminar el perfil. Inténtalo más tarde.', 'error');
        });
      }
    });
  }


  cambiarImagen(event: any) {
    const file = event.target.files[0];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const extension = file.name.split('.').pop()?.toLowerCase();

if (!validExtensions.includes(extension)) {
  Swal.fire('Solicitud denegada', 'El archivo no es una imagen válida', 'error');
  return;
}


    Swal.fire({
  title: 'Procesando...',
  text: 'Por favor espera',
  allowOutsideClick: false,
  didOpen: () => {
    Swal.showLoading();
  }
});
        console.log(this.user);
        this.usuarioService.cambiarImagen(this.user,file).subscribe(response => {
          Swal.close();
          Swal.fire('Imagen actualizada', '', 'success');
          
          this.usuario['imagen'] = response.mensaje;
          this.imagenPerfil.nativeElement.src = this.usuario['imagen'];
        }, error => {
          Swal.close();
          
          Swal.fire('Error al actualizar la imagen', '', 'error');
        });
      
      
    
  }
}
