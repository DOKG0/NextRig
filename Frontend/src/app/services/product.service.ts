import { Injectable } from '@angular/core';
import { productsList, Product } from '../components/product/product-card/products.mock';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Product[] = productsList;
  productsSortedByCat: Product[] = productsList;
  category: string = '';
  constructor() { }

  setProductsSortedByCat(products: Product[]) {
    this.productsSortedByCat = products;
    localStorage.setItem('productsSortedByCat', JSON.stringify(products));

  }

  getProductsSortedByCat(category : string): Product[] {
    if (this.category === category) {
      const stored = localStorage.getItem('productsSortedByCat');
    if (stored) {
      this.productsSortedByCat = JSON.parse(stored);
    }
    this.category = category;
    return this.productsSortedByCat;
    }
    else {
      return [];
    }
  }

  getCategory(): string {
    return this.category;
  }

  getProductById(id: string | number): Product | undefined {
    return productsList.find(p => p.id == id);
  }

  getAllProducts(): Product[] {
    return productsList;
  }

  getProductsByCategory(category : string): Product[] {
    const products : Product[] = productsList.filter((product) => product.category === category);
    return products;
  }
}
