import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ContentContainerComponent } from './components/content-container/content-container.component';
import { NewProductFormComponent } from './components/new-product-form/new-product-form.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '',
    component: ContentContainerComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // redirige al iniciar
      { path: 'home', component: HomeComponent },
      { path: 'product-form', component: NewProductFormComponent },
      { path: 'product-form/update/:id', component: NewProductFormComponent },

    ]
  },
  { path: '**', redirectTo: '' } // redirección por defecto para rutas no válidas
];
