import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../product-card/products.mock';
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
  activeTab: 'general' | 'additional' = 'general';


  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productosSimilares = this._productService.getProductsSortedByCat();

    if (id) {
      this.producto = this._productService.getProductById(id);
    }
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
}