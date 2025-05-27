import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
    //private apiUrl = 'http://localhost/Backend/api.php';
    private apiUrl = 'http://localhost/NextRig/Backend/api.php';
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

    getCarrito(username : string): Observable<any> {
       
        return this.http.get(`${this.apiUrl}/carrito/${username}`);
    }

    agregarCarrito(username: string, idProducto: string,cantidad: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/usuario/cantidad`, { username, idProducto,cantidad });
    }

    eliminarProductoCarrito(username: string, idProducto: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/usuario/eliminarProductoCarrito`,{body:{ username,idProducto}});
    }

    comprarCarrito(username: string, idProducto: string, costoCarrito: number,cantidad: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/usuario/comprarCarrito`, {
    username,
    idProducto,
    costoCarrito,
    cantidad
  });
}

getHistorial(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/historial/${username}`);
}
}