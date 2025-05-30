export interface Review extends Record<string, any>{
    id?: number,
    mensaje: string,
    puntaje: number,
    idProducto: string,
    username: string
}
