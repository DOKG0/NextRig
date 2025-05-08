import { Component } from '@angular/core';
import { productsList } from './products.mock';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  products = productsList;
  quantity = 0;
  
}
