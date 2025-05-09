import { Injectable } from '@angular/core';
import { productsList, Product } from '../product/product-card/products.mock';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

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
