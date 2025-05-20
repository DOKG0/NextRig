import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marca } from '../interfaces/marca';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {
  private apiUrl = 'http://localhost/NextRig/Backend/api.php/marcas';
  private apiAddMarcaUrl = 'http://localhost/NextRig/Backend/api.php/admin/addMarca'

  constructor(private http: HttpClient) { }

  getMarcas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addMarca(nombreMarca: string) {
    const nuevaMarca: Marca = { marca_nombre: nombreMarca };
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }    
    return this.http.post(`${this.apiAddMarcaUrl}`, nuevaMarca, httpOptions);
  } 

  existeMarca(nombreMarca: string) {
    return this.http.get(`${this.apiUrl}/${nombreMarca}`);
  }
}