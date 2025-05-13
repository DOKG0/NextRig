import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { productsList } from '../product-card/products.mock';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../product-card/products.mock';
import { FormsModule } from '@angular/forms';
import { MarcasCarrouselComponent } from '../../marcas-carrousel/marcas-carrousel.component';


@Component({
  selector: 'app-products-grid',
  imports: [ProductCardComponent, CommonModule, FormsModule, MarcasCarrouselComponent],
  templateUrl: './products-grid.component.html',
  styleUrl: './products-grid.component.css'
})
export class ProductsGridComponent implements OnInit {

  productsSorted: Product[] = [];
  selectedSort: string = '';


  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService
  ) {}

  // ngOnInit(): void {
  //   const category = this.route.snapshot.paramMap.get('category');

  //   console.log(category);
  //   if (category) {
  //     const cached = this._productService.getProductsSortedByCat(category);
  //     console.log(cached);
  //     if (cached.length > 0) {
  //       this.productsSorted = [...cached];
  //     } else {
  //       this.productsSorted = this._productService.getProductsByCategory(category);
  //       this._productService.setProductsSortedByCat(this.productsSorted);
  //     }
  //   }
  // }

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
    this.productsSorted = [...this.productsSorted].sort((a, b) => b.nombre.localeCompare(a.nombre));
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
