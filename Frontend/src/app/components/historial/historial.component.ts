import { CommonModule, } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuarios.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-historial',
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent {
user: string = JSON.parse(localStorage.getItem('currentUser') || '{}').username;
  productos: any[] = [];
  hayProductos: boolean = false;
  searchText: string = '';

  @ViewChild('detalleCompra', { static: true }) templateDetalle!: TemplateRef<any>;
@ViewChild('conProductos', { static: true }) templateConProductos!: TemplateRef<any>;
@ViewChild('sinProductos', { static: true }) templateSinProductos!: TemplateRef<any>;

templateActual!: TemplateRef<any>;
contextoActual: any = {};
  



verCompra(compra: any[]) {
   this.templateActual = this.templateDetalle;
  this.contextoActual = { $implicit: compra }; 
}


  constructor(private usuarioService: UsuarioService,private router: Router) {
    this.getHistorial();
      
  }

  getHistorial() {
    
   this.usuarioService.getHistorial(this.user).subscribe((data: any) => {
      this.productos = data;
      if (this.productos.length > 0) {
        this.hayProductos = true;
      }
    if (this.hayProductos) {
    this.templateActual = this.templateConProductos;
  }else {
    this.templateActual = this.templateSinProductos;
  }
    });
    
  }

  volverAtras() {
    this.templateActual = this.templateConProductos;
    this.contextoActual = {};
    }

  
  volverAComprar(id : string) {
  this.router.navigate(['/products', id]);
}

productosFiltrados() {
  return this.productos.filter(p =>
    p.nombre.toLowerCase().includes(this.searchText.toLowerCase())
  );
}

goToSection(id: string) {
  this.router.navigate(['/products',id]).then(() => {
    setTimeout(() => {
      const element = document.getElementById('indexReview');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center'
         });
      }
    }, 400); 
  });
}




}
