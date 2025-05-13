import { AfterViewInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { productsList } from './products.mock';
import { CommonModule } from '@angular/common';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs';


declare var bootstrap: any;
@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements AfterViewInit {

  products = productsList;
  quantity : number = 0;
  @Input() producto: any;

 constructor(private router: Router, private viewportScroller: ViewportScroller) {
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
}


  minusQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  plusQuantity() {
    this.quantity++;
  }

  resetQuantity() {
    this.quantity = 0;
  }

  ngAfterViewInit(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl: any) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
    window.scrollTo(0, 0);
  }
}
