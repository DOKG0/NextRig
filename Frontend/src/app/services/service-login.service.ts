import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ServiceLoginService {
  private _http = inject(HttpClient); // Inyecta HttpClient en la variable _http para realizar solicitudes HTTP
  private urlBase: string = '/Backend/api.php/login';

  public enviarDatos(datos: any): Observable<any> {
    return this._http.post(this.urlBase, datos);
  }

}