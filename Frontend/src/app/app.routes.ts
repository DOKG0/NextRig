import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ContentContainerComponent } from './components/content-container/content-container.component';
import { ProductsGridComponent } from './components/product/products-grid/products-grid.component';
import { ProductDetailsComponent } from './components/product/products-details/product-details.component';
import { HomeComponent } from './components/home/home.component';
import { NewProductFormComponent } from './components/new-product-form/new-product-form.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { HistorialComponent } from './components/historial/historial.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ProductFormComponent } from './components/product-form/product-form.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: ContentContainerComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },  // o tu componente home
      { path: 'products', component: ProductsGridComponent },
      { path: 'products/category/:category', component: ProductsGridComponent },
      { path: 'products/:id', component: ProductDetailsComponent },
      { path: 'product-form', component: NewProductFormComponent },
      { path: 'product-form/update/:id', component: NewProductFormComponent },
      { path: 'cart', component: CarritoComponent},
      {path: 'profile', component: PerfilComponent},
      {path: 'orders',component: HistorialComponent}
      { path: 'product-form', component: ProductFormComponent },
      { path: 'product-form/update/:id', component: ProductFormComponent }
    ]
  },
  { path: '**', redirectTo: '' } // redirección por defecto para rutas no válidas
];
