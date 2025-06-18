import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../interfaces/review';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = 'http://localhost/NextRig/Backend/api.php';

  constructor(private httpClient: HttpClient) { }

  postReview(review: Review): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    }
    return this.httpClient.post(`${this.apiUrl}/reseña`, review, httpOptions);
  }

  getReviewsDeProducto(idProducto: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/reseñas/${idProducto}`);
  }

  deleteReview(idProducto: string, username: string): Observable<any> {
    const httpOptions = {
        withCredentials: true
    }
    return this.httpClient.delete(`${this.apiUrl}/reseña?idProducto=${idProducto}`, httpOptions);
  }

  getPromedioPuntajeDeProducto(idProducto: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/producto/puntaje?idProducto=${idProducto}`);
  }

  getReviewsDeUsuario(username: string): Observable<any> {
    const httpOptions = {
        withCredentials: true
    }
    return this.httpClient.get(`${this.apiUrl}/usuario/misReseñas`, httpOptions);
  }

  getUsuarioHabilitadoParaReviewDeProducto(idProducto: string, username: string) {
    const httpOptions = {
        withCredentials: true
    }
    return this.httpClient.get(`${this.apiUrl}/usuario/habilitado-para-reseña?idProducto=${idProducto}`, httpOptions);
  }
}
