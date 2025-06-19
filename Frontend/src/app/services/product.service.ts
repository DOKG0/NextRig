import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  //Estados
  products: Product[] = [];
  productsSortedByCat: Product[] = [];
  category: string = '';

  private apiAdminUrl = "http://localhost/NextRig/Backend/api.php/admin";
  private apiUrl = 'http://localhost/NextRig/Backend/api.php/productos';

  constructor(private http: HttpClient) { }

  //Observers
  addProduct(product: Product): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };
    return this.http.post(`${this.apiAdminUrl}/addProduct`, product, httpOptions);
  }

  updateProduct(product: Product): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };
    return this.http.post(`${this.apiAdminUrl}/updateProduct`, product, httpOptions);
  }

  deleteProduct(id: string): Observable<any> {
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true,
    body: {
      producto_id: id
    }
  };
  return this.http.delete(`${this.apiAdminUrl}/eliminarProducto`, httpOptions);
}

  getProductoById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/id/${id}`);
  }

  getProductosByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${category.toLowerCase()}`);
  }

   getProductosByCategoryAndMarca(category: string, marca: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${category.toLowerCase()}/marca/${marca.toLowerCase()}`);
  }

  //Logica de negocios
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

  getTopRatedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost/NextRig/Backend/api.php/productos/top-rated');
  }

  searchProducts(queryValue: string): Observable<Product[]> {
    return this.http.get<Product[]>(`http://localhost/NextRig/Backend/api.php/search?query=${queryValue}`);
  }

  getProductosMasBaratos(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/mas-baratos`);
  }
}
