import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { productsList } from '../product-card/products.mock';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../product-card/products.mock';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-grid',
  imports: [ProductCardComponent, CommonModule, FooterComponent, FormsModule],
  templateUrl: './products-grid.component.html',
  styleUrl: './products-grid.component.css'
})
export class ProductsGridComponent implements OnInit {

  productsSorted: Product[] = productsList;
  selectedSort: string = '';

  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService
  ) {}

  ngOnInit(): void {
    const category = this.route.snapshot.paramMap.get('category');

    if (category) {
      this.productsSorted = [...this._productService.getProductsByCategory(category)];
      this._productService.setProductsSortedByCat(this.productsSorted);
    }
  }

  sortedByPriceAsc() {
    this.productsSorted = this.productsSorted.sort((a, b) => a.price - b.price);
  }
  
  sortedByPriceDesc() {
    this.productsSorted = this.productsSorted.sort((a, b) => b.price - a.price);
  }
  
  sortedByNameAsc() {
    this.productsSorted = this.productsSorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  sortedByNameDesc() {
    this.productsSorted = [...this.productsSorted].sort((a, b) => b.name.localeCompare(a.name));
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
