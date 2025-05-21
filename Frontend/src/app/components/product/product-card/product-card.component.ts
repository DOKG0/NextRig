import { AfterViewInit, Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router, RouterConfigOptions, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs';
import { UsuarioService } from '../../../services/usuarios.service';


declare var bootstrap: any;
@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements AfterViewInit {
  quantity : number = 0;
  @Input() producto: any;
  @Output() ejecutarTopPadre = new EventEmitter<void>();

  constructor(private usuarioService: UsuarioService) {   
  }

  minusQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  plusQuantity() {
    this.quantity++;
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

  agregarAlCarrito(quantity : number) {

  if(quantity === 0){
    quantity = 1;
  }
  let nombreUsuario = JSON.parse(localStorage.getItem('currentUser') || '{}').username;
    if (!this.producto || this.producto.id === undefined) {
    console.error('Producto no definido o sin ID');
    return;
  }else{
    let idProducto = this.producto.id as string;
    console.log('ID del producto:', idProducto);
    console.log('Nombre de usuario:', nombreUsuario);
    console.log('Cantidad:', quantity);
  this.usuarioService.agregarCarrito(nombreUsuario,idProducto,quantity).subscribe((data: any) => {
      }
    );
}
}
}
