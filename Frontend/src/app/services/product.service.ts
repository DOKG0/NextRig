import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost/sites/NextRig/Backend/api.php';
  constructor(private http: HttpClient) { }

  products: Product[] = [];
  productsSortedByCat: Product[] = [];
  category: string = '';

  getProductoById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/id/${id}`);
  }

  addProduct(product: Product): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }    
    return this.http.post(`${this.apiUrl}/admin/addProducto`, product, httpOptions);
  }

}
