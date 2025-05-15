import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product';
import { FormsModule } from '@angular/forms';
import { MarcasCarrouselComponent } from '../../marcas-carrousel/marcas-carrousel.component';
import { MarcasService } from '../../../services/marcas.service';


@Component({
  selector: 'app-products-grid',
  imports: [ProductCardComponent, CommonModule, FormsModule, MarcasCarrouselComponent],
  templateUrl: './products-grid.component.html',
  styleUrl: './products-grid.component.css'
})
export class ProductsGridComponent implements OnInit {

  productsSorted: Product[] = [];
  selectedSort: string = '';
  marcas : String[] = [];
  marcasSorted : string[] = [];

  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService,
    private _marcasService: MarcasService
  ) {}

  ngOnInit(): void {
    const category = this.route.snapshot.paramMap.get('category');
    

    if (category) {
      const cached = this._productService.getProductsSortedByCat(category);
      if (cached.length > 0){
        this.productsSorted = [...cached];
      } else {
        this._productService.getProductosByCategory(category).subscribe({
          next: (productos) => {
            this.productsSorted = productos;
            this._productService.setProductsSortedByCat(this.productsSorted);
          },
          error: (err) => {
            console.error("Error obteniendo todos los productos:", err);
          },
          complete: () => {
            console.log('Petición finalizada');
          }
        });
      }
    } 
    this.fetchMarcas();
  }

  fetchMarcas(): void {
    this._marcasService.getMarcas().subscribe({
      next: response => {
        this.marcas = response; 
        this.sortMarcas();
        console.log(this.marcasSorted);
      },
      error: err => {
        console.log("Error");        
      }
    });   
  }

  sortMarcas(){
     for(const producto of this.productsSorted){
      if(!this.marcasSorted.includes(producto.marca_nombre))
        this.marcasSorted.push(producto.marca_nombre);
     }
  }

  sortedByPriceAsc() {
    this.productsSorted = this.productsSorted.sort((a, b) => a.precio - b.precio);
  }
  
  sortedByPriceDesc() {
    this.productsSorted = this.productsSorted.sort((a, b) => b.precio - a.precio);
  }
  
  sortedByNameAsc() {
    this.productsSorted = this.productsSorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
  
  sortedByNameDesc() {
    this.productsSorted = this.productsSorted.sort((a, b) => b.nombre.localeCompare(a.nombre));
  }

  handleSort(option: string) {
    switch (option) {
      case 'priceAsc':
        this.sortedByPriceAsc();
        break;
      case 'priceDesc':
        this.sortedByPriceDesc();
        break;
      case 'nameAsc':
        this.sortedByNameAsc();
        break;
      case 'nameDesc':
        this.sortedByNameDesc();
        break;
    }
  }

  
}
