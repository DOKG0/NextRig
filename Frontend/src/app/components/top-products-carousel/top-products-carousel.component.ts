
// filepath: Frontend/src/app/components/top-products-carousel/top-products-carousel.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../interfaces/product';
import { ProductCardComponent } from '../product/product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-products-carousel',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './top-products-carousel.component.html',
  styleUrl: './top-products-carousel.component.css'
})
export class TopProductsCarouselComponent implements OnInit, OnDestroy {
  @Input() productos: Product[] = [];
  currentIndex: number = 0;
  intervalId: any;
  @Input() titulo: string = '';

  ngOnInit() {
    this.startAutoSlide();
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    window.removeEventListener('resize', this.onResize);
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.next();
    }, 3000);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.productos.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.productos.length) % this.productos.length;
  }

  goTo(index: number) {
    this.currentIndex = index;
  }

  getVisibleProducts(): Product[] {
    const width = window.innerWidth;
    const count = width < 1320 ? 1 : 3;
    const visible: Product[] = [];
    for (let i = 0; i < count; i++) {
      visible.push(this.productos[(this.currentIndex + i) % this.productos.length]);
    }
    return visible;
  }

  onResize = () => {
    this.currentIndex = 0;
  };
}