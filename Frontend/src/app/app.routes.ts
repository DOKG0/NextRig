import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ContentContainerComponent } from './components/content-container/content-container.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
  {path: '', component: ContentContainerComponent, pathMatch: 'full' },
  { path: 'home', component: ContentContainerComponent, pathMatch: 'full' }

];
