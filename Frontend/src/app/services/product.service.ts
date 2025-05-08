import { Injectable } from '@angular/core';
import { productsList, Product } from '../product/product-card/products.mock';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  getProductoById(id: string | number): Product | undefined {
    return productsList.find(p => p.id == id);
  }

  getAllProductos(): Product[] {
    return productsList;
  }
}
