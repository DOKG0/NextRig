export interface ResponseAddProduct extends Record<string, any>  {
    success?: boolean,
    mensaje?: string,
    id?: string,
    httpCode?: number,
    error?: string,
    errCode?: any,
}
