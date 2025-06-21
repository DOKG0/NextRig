import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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
        return this.http.post(`${this.apiUrl}/usuario/login`, { correo, password }, { withCredentials: true });
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
        }, { withCredentials: true });
    }

    generarFactura(idCompra: number): Observable<any> {
        const options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        }),
        withCredentials: true
        };
        
        return this.http.post(`${this.apiUrl}/generar-factura`, { idCompra }, options);
    }

    descargarFactura(idCompra: number): void {
        const url = `${this.apiUrl}/descargar-factura/${idCompra}`;
        window.open(url, '_blank');
    }

    eliminarFactura(idCompra: number) {
        return this.http.delete(`${this.apiUrl}/eliminar-factura/${idCompra}`);
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

crearCompra(username: string, costoCarrito: number,telefono: number,direccion: string,departamento: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/crearCompra`, { username, costoCarrito, telefono, direccion, departamento }, { withCredentials: true });
}

getUsuario(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/perfil/${username}`);
}

actualizarUsuario(username: string,campo: string, valor: string): Observable<HttpResponse<any>> {
    return this.http.put<HttpResponse<any>>(`${this.apiUrl}/actualizar`, {username, campo, valor },{observe: 'response'});
}

getCantidadproducto(username: string,idProducto: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/controlStock/${username}/${idProducto}`);
}

}