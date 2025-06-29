import { AfterViewInit, Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router, RouterConfigOptions, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewportScroller } from '@angular/common';
import { filter, lastValueFrom } from 'rxjs';
import { UsuarioService } from '../../../services/usuarios.service';
import { ReviewStarsComponent } from '../../review-stars/review-stars.component';
import Swal from 'sweetalert2';
import { ProductService } from '../../../services/product.service';

declare var bootstrap: any;
@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule, ReviewStarsComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements AfterViewInit {
  quantity : number = 0;
  user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  contadorQuantity : number = 0;
  @Input() producto: any;
  @Output() ejecutarTopPadre = new EventEmitter<void>();

  constructor(
    private usuarioService: UsuarioService,
    private _productService: ProductService
) {}

  minusQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  plusQuantity() {
    if (this.quantity < this.producto.stock) {
      this.quantity++;
    }
  }

  resetQuantity() {
    this.quantity = 0;
  }

  ngAfterViewInit(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl: any) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  enviarPadre() {
    this.ejecutarTopPadre.emit(); 
  }

  async agregarAlCarrito(quantity : number) {
   
    if (quantity === 0) {
      quantity = 1;
    }
    let nombreUsuario = this.user.username;
    try {
       
        let cantidadEnCarrito = Number(await lastValueFrom(this.usuarioService.getCantidadproducto(nombreUsuario, this.producto.id as string)));
        
        if(this.producto.stock == 0){
                Swal.fire({
                  title: "Sin stock",
                  icon: "error",
                  showClass: {
                    popup: 'animate__animated animate__fadeInDown animate__faster'
                  },
                  hideClass: {
                    popup: 'animate__animated animate__fadeOut animate__faster'
                  }
                });
                return;
              }
              
        if ((cantidadEnCarrito + quantity) > this.producto.stock) {
          Swal.fire({
            title: "Has alcanzado la cantidad maxima para este producto",
            icon: "warning",
            showClass: {
              popup: 'animate__animated animate__fadeInDown animate__faster'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOut animate__faster'
            }
          }
          );
          return;
        } else {

          if (!this.producto || this.producto.id === undefined) {
            console.error('Producto no definido o sin ID');
            return;
          } else {
            let idProducto = this.producto.id as string;
            this.resetQuantity();
            this.alertProductoCarritoToast(this.producto.nombre);
            this.usuarioService.agregarCarrito(nombreUsuario, idProducto, quantity).subscribe((data: any) => {
            }
            );
          }

        }
    } catch (error) {
      console.error("error en el agregado", error);
    }

    }

    alertDeleteConfirmation(): void {
    Swal.fire({
        title: '¿Estás seguro de eliminar el producto?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        showClass: {
          popup: 'animate__animated animate__fadeInDown animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOut animate__faster'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            this._productService.deleteProduct(this.producto.id).subscribe({
                next: (response) => {
                    Swal.fire('¡Eliminado!', 'El producto fue eliminado.', 'success', );
                    console.log('Producto eliminado con éxito', response);
                },
                error: (error) => {
                    Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
                    console.error('Error al eliminar el producto:', error);
                }
            });
        } else {
            this.alertCancelToast();
            console.log('Eliminación cancelada');
        }
    });
    }

    alertProductoCarritoToast(data: string): void {
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: `Producto '${data}' agregado al carrito correctamente`,
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 5000,
        showClass: {
          popup: 'animate__animated animate__fadeInDown animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOut animate__faster'
        }
      });
    }

    

    alertCancelToast(): void {
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'error',
        title: "Operación cancelada",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000,
        showClass: {
          popup: 'animate__animated animate__fadeInDown animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOut animate__faster'
        }
      });
    }
}
 
