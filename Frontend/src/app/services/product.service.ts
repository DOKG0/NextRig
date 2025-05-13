import { Injectable } from '@angular/core';
import { productsList, Product } from '../components/product/product-card/products.mock';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Product[] = [];
  productsSortedByCat: Product[] = [];
  category: string = '';

  
  private apiUrl = 'http://localhost/NextRig/Backend/api.php/productos';
  constructor(private http: HttpClient) { }

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProductosByCategory(category: string): Observable<Product[]> {
    if (this.category === category) {
      const stored = localStorage.getItem('productsSortedByCat');
    if (stored) {
      this.productsSortedByCat = JSON.parse(stored);
    }
    this.category = category;
    }
    return this.http.get<Product[]>(`${this.apiUrl}/${category.toLowerCase()}`);
  }

    getProductoById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/id/${id}`);
  }


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
  
}
