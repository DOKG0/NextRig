import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ContentContainerComponent } from './components/content-container/content-container.component';
import { ProductsGridComponent } from './components/product/products-grid/products-grid.component';
import { ProductDetailsComponent } from './components/product/products-details/product-details.component';
import { HomeComponent } from './components/home/home.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { HistorialComponent } from './components/historial/historial.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { AuthGuardAdmin } from './guards/auth.guard.admin';
import { NotFoundComponent } from './components/not-found/not-found.component';


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
      { path: 'product-form', component: ProductFormComponent, canActivate: [AuthGuardAdmin] },
      { path: 'product-form/update/:id', component: ProductFormComponent, canActivate: [AuthGuardAdmin] },
      { path: 'cart', component: CarritoComponent},
      { path: 'profile', component: PerfilComponent},
      { path: 'orders',component: HistorialComponent},
      { path: '404', component: NotFoundComponent }
    ]
  },
  { path: '**', redirectTo: '404' } // redirección por defecto para rutas no válidas
];
