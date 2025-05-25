import { Component } from '@angular/core';
import { ContactoService } from '../../services/contacto.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',
  imports: [FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  nombre = '';
  email = '';
  mensaje = '';

  constructor(private contactoService: ContactoService) { }

  enviarContacto() {
    Swal.fire({
      title: 'Enviando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });


    this.contactoService.enviarMensaje(this.nombre, this.email, this.mensaje)
    .subscribe({
      next: (res) => {
        Swal.close();
        Swal.fire({
          icon: res.success ? 'success' : 'error',
          title: res.success ? '¡Mensaje enviado!' : 'Error',
          text: res.mensaje || (res.success ? 'Tu mensaje fue enviado correctamente.' : 'Ocurrio un error al enviar el mensaje.')
        });
        if (res.success) {
          this.nombre = '';
          this.email = '';
          this.mensaje = '';
        }
      },
      error: () => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al enviar el mensaje. Intenta nuevamente.'
        });
      }
    });
  }
}
