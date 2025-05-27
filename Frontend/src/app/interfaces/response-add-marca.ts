export interface ResponseAddMarca extends Record<string, any>  {
    success: boolean,
    mensaje: string,
    marca?: string,
    error?: string,
}
