import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Product[] = [];
  productsSortedByCat: Product[] = [];
  category: string = '';

  private apiAdminUrl = "http://localhost/NextRig/Backend/api.php/admin";
  private apiUrl = 'http://localhost/NextRig/Backend/api.php/productos';
  constructor(private http: HttpClient) { }

  addProduct(product: Product): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }    
    return this.http.post(`${this.apiAdminUrl}/addProduct`, product, httpOptions);
  }

  updateProduct(product: Product): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post(`${this.apiAdminUrl}/updateProduct`, product, httpOptions);
  }

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
