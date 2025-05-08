import { Component } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { productsList } from '../product-card/products.mock';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
@Component({
  selector: 'app-products-grid',
  imports: [ProductCardComponent, CommonModule, FooterComponent],
  templateUrl: './products-grid.component.html',
  styleUrl: './products-grid.component.css'
})
export class ProductsGridComponent {

  products = productsList;

}
