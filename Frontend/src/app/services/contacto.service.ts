import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ContactoService {
  constructor(private http: HttpClient) {}

  enviarMensaje(nombre: string, email: string, mensaje: string) {
    return this.http.post<any>('http://localhost/NextRig/Backend/api.php/contacto', {
      nombre,
      email,
      mensaje
    });
  }
}