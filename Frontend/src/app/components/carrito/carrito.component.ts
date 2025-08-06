import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuarios.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-carrito',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
carrito: any[] = [];
  total: number = 0;
  user: string = JSON.parse(localStorage.getItem('currentUser') || '{}').username;
  hayProductos: boolean = false;
  usuario: any;

  quiereComprar: boolean = false;
  userForm: FormGroup;
  submitted = false;
  responseMessage = '';

  constructor(private fb: FormBuilder,private router: Router, private usuarioService: UsuarioService) {
   this.userForm = this.fb.group({
      telefono: ['', [Validators.required,Validators.pattern(/^\+?[0-9]{4,15}$/)]],
      departamento: ['', Validators.required],
      direccion: ['', Validators.required]
    });
    this.getCarrito();
    
  }

  getCarrito() {
    
    this.usuarioService.getCarrito(this.user).subscribe((data: any) => {
      this.carrito = data;
      if (this.carrito.length > 0) {
        this.hayProductos = true;
        for (let i = 0; i < this.carrito.length; i++) {
          if(this.carrito[i].cantidad > 0){
          this.total += Number(this.carrito[i].precio * this.carrito[i].cantidad); 
          }else{
            this.total += Number(this.carrito[i].precio);
            this.carrito[i].cantidad = 1;
          }
        }
     
        
      }
    });
  }

  eliminarProducto(producto: any) {
    this.usuarioService.eliminarProductoCarrito(this.user, producto.id,).subscribe({
      next: () => {
        this.carrito = this.carrito.filter(p => p.id !== producto.id);
        this.total = this.carrito.reduce((sum, p) => sum + Number(p.precio) * p.cantidad, 0);
        if (this.carrito.length === 0) {
          this.hayProductos = false;
        }
      },
    });
  }

  verProducto(id: string) {
    this.router.navigate(['/products', id]);
  }

  comprar() {
    this.quiereComprar = true;
  }

  get f() {
    return this.userForm.controls;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) return;

    let telefonoNumber = this.userForm.get('telefono')?.value;
    this.total = this.total - (this.total * 0.15);

    try {
      Swal.fire({
            title: 'Procesando pago...',
            text: 'Por favor espera mientras procesamos tu compra',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOut animate__faster'
              }
        });
    // -> aqui se crea la compra
    const compraResult = await lastValueFrom(
      this.usuarioService.crearCompra(
        this.user, 
        this.total, 
        telefonoNumber, 
        this.userForm.get('direccion')?.value, 
        this.userForm.get('departamento')?.value
      )
    );

    // -> se agregan los productos a la compra
    for (let i = 0; i < this.carrito.length; i++) {
      await lastValueFrom(
        this.usuarioService.comprarCarrito(
          this.user, 
          this.carrito[i].id, 
          this.carrito[i].precio, 
          this.carrito[i].cantidad
        )
      );
    }

    // -> genera solamente la facutura si se obtuvo el id de cmpra
    let facturaGenerada = false;
    let emailEnviado = false;
    if (compraResult.idCompra) {
      try {
          const facturaResult = await lastValueFrom(this.usuarioService.generarFactura(compraResult.idCompra));
          facturaGenerada = true;
          emailEnviado = facturaResult.emailSent || false;
      } catch (error) {
          this.facturaError();
      }
  }

  const mensajeHtml = facturaGenerada && compraResult.idCompra ? 
      `Tu compra se ha procesado correctamente.<br><br>
        ${emailEnviado ? '<div style="color: #28a745; margin: 10px 0;"><strong>✅ Factura enviada a tu email</strong></div>' : ''}
        <div style="margin-top: 15px;">
          <button id="descargar-factura" style="background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
            📄 Descargar Factura
          </button>
        </div>` :
      'Tu compra se ha procesado correctamente.';
      
  Swal.fire({
      icon: 'success',
      title: '¡Compra realizada con éxito!',
      html: mensajeHtml,
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
      didOpen: () => {
          const botonDescargar = document.getElementById('descargar-factura');
          if (botonDescargar && compraResult.idCompra) {
              botonDescargar.addEventListener('click', () => {
                  this.usuarioService.descargarFactura(compraResult.idCompra);
                  setTimeout(() => {
                      this.usuarioService.eliminarFactura(compraResult.idCompra).subscribe({
                          next: (response) => {
                              Swal.fire({
                                toast: true,
                                position: 'top-end',
                                icon: 'success',
                                title: 'Factura eliminada correctamente',
                                showConfirmButton: false,
                                timer: 2000,
                                timerProgressBar: true
                              });
                          },
                          error: (error) => {
                              this.facturaError();
                          }
                      });
                  }, 2000);
              });
          }
      },
      showClass: {
          popup: 'animate__animated animate__fadeInDown animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOut animate__faster'
        }
      }).then(() => {

        if (facturaGenerada && compraResult.idCompra) {
          this.usuarioService.eliminarFactura(compraResult.idCompra).subscribe({
            next: (response) => {
            },
            error: (error) => {
            }
          });
        }

        this.eliminarTodos();
        this.carrito.length = 0;
        this.userForm.reset();
        this.submitted = false;
        this.hayProductos = false;
      });
    } catch (error) {
    }
  }

  eliminarTodos() {
    for (let i = 0; i < this.carrito.length; i++) {

      this.usuarioService.eliminarProductoCarrito(this.user, this.carrito[i].id).subscribe({
        next: () => {
          this.carrito.length = 0;
          this.hayProductos = false;
          this.total = 0;
        },
      });
    }
  }

  facturaError() {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Error al eliminar factura',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  }

}
