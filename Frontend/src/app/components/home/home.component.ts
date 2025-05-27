import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { TopProductsCarouselComponent } from "../top-products-carousel/top-products-carousel.component";


@Component({
  selector: 'app-home',
  imports: [TopProductsCarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  destacados: Product[] = [];
  baratos: Product[] = [];
  
  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getTopRatedProducts().subscribe(productos => {
      this.destacados = productos;
    });

    this.productService.getProductos().subscribe(productos => {
      this.baratos = productos
        .sort((a, b) => a.precio - b.precio)
        .slice(0, 10);
    });
  }
}
