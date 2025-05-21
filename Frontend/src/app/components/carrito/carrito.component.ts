import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuarios.service';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
carrito: any[] = [];
  total: number = 0;
  user: string = JSON.parse(localStorage.getItem('currentUser') || '{}').username;
  hayProductos: boolean = false;
  usuario: any;
  constructor(private router: Router, private usuarioService: UsuarioService) {
   
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
    console.log(producto.id);
    console.log(this.user);
   this.usuarioService.eliminarProductoCarrito(this.user, producto.id,).subscribe({
     next: () => {
      this.carrito = this.carrito.filter(p => p.id !== producto.id);

      this.total = this.carrito.reduce((sum, p) => sum + Number(p.precio) * p.cantidad, 0);

      if(this.carrito.length === 0) {
      this.hayProductos = false;
      }
    },
   });
   
  }

verProducto(id : string) {
  this.router.navigate(['/products', id]);
}



  comprar() {
    for (let i = 0; i < this.carrito.length; i++) {
      console.log(this.carrito[i].id);
      console.log(this.carrito[i].precio);
      console.log(this.user);
    this.usuarioService.comprarCarrito(this.user, this.carrito[i].id,this.carrito[i].precio,this.carrito[i].cantidad).subscribe({
        next: () => {
      this.carrito.length = 0;


      if(this.carrito.length === 0) {
      this.hayProductos = false;
      }
    },
});
  }
}
}
