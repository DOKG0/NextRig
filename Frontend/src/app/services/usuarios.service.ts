import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
    private apiUrl = 'http://localhost/Backend/api.php';
    constructor(private http: HttpClient) { }

    login(correo: string, password: string): Observable<any> {
        //ruta login de a api /usuario/login
        //http://localhost/Backend/api.php/usuario/login
        return this.http.post(`${this.apiUrl}/usuario/login`, { correo, password });
    }
    
    registro(nombre: string, apellido: string, username: string, correo: string,ci: string, password: string, fechaNac: string): Observable<any> {
        // ruta registro de la api /usuario/registro
        // http://localhost/Backend/api.php/usuario/registro
        return this.http.post(`${this.apiUrl}/usuario/registro`, { 
            nombre, 
            apellido, 
            username, 
            correo,
            ci, 
            password,
            fechaNac
        });
    }
}