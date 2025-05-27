export interface Product extends Record<string, any> {
    admin_ci: string;
    categoria: string;
    descripcion: string;
    id: number | string;
    imagen: string;
    marca_nombre : string;
    nombre: string;
    precio: number;
    stock: number;
  }
