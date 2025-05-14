import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {
  private apiUrl = 'http://localhost/sites/NextRig/Backend/api.php/marcas';

  constructor(private http: HttpClient) { }

  getMarcas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}