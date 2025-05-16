import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product'
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})

export class ProductDetailsComponent implements OnInit {
  producto: Product | undefined;
  quantity: number = 0;
  productosSimilares: Product[] = [];
  productosSimilaresRandom : Product[] = [];
  activeTab: 'general' | 'additional' = 'general';

  @ViewChild('topOfDetails') topOfDetails!: ElementRef;
  @ViewChild('generalInfo') generalInfo!: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      this.productosSimilares = this._productService.getProductsSortedByCat(this._productService.getCategory());
      if (id) {
        this._productService.getProductoById(id).subscribe({
          next: (producto) => {
            this.producto = producto; 
            console.log('Producto cargado:', producto);
          },
          error: (err) => {
            console.error('Error al obtener el producto:', err);
          }
        });
      }
    });
    this.setRandomProducts();
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
  
  selectTab(tab: 'general' | 'additional') {
    this.activeTab = tab;
  }

  setRandomProducts() {
    const randomProducts: Product[] = [];
    const usedIndexes = new Set<number>();

    while (randomProducts.length < 3 && this.productosSimilares.length > 0) {
      const randomIndex = this.getRandomInt(0, this.productosSimilares.length - 1);
      
      if (!usedIndexes.has(randomIndex)) {
        usedIndexes.add(randomIndex);
        randomProducts.push(this.productosSimilares[randomIndex]);
      }
    }
    this.productosSimilaresRandom = randomProducts;
  }

  top(){
    setTimeout(() => {
      this.topOfDetails.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }
}