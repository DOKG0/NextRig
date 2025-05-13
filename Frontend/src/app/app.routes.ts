import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ContentContainerComponent } from './components/content-container/content-container.component';
import { ProductsGridComponent } from './components/product/products-grid/products-grid.component';
import { ProductDetailsComponent } from './components/product/products-details/product-details.component';
import { HomeComponent } from './components/home/home.component';

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
    ]
  },
  { path: '**', redirectTo: '' } // redirección por defecto para rutas no válidas
];
