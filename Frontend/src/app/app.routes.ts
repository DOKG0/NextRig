import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ContentContainerComponent } from './components/content-container/content-container.component';
import { ProductCardComponent } from './product/product-card/product-card.component';
import { ProductsGridComponent } from './product/products-grid/products-grid.component';
import { ProductDetailsComponent } from './product/products-details/product-details.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: ContentContainerComponent, pathMatch: 'full' },
  { path : "products", component : ProductsGridComponent},
  { path : "products/:id", component : ProductDetailsComponent},
  { path: 'home', component: ContentContainerComponent, pathMatch: 'full' }
];
