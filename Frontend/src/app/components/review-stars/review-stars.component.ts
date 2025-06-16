import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-review-stars',
  imports: [CommonModule],
  templateUrl: './review-stars.component.html',
  styleUrl: './review-stars.component.css'
})
export class ReviewStarsComponent implements OnInit{

  @Input() producto: any;
  @Input() rating = 4;
  reviewsCount = 0;
  @Input() flagStatus : boolean = false;

  constructor(
    private _reviewService: ReviewService
  ) {}


  ngOnInit(): void {
    if (this.producto !== undefined && this.producto.id !== undefined) {
      this._reviewService.getPromedioPuntajeDeProducto(this.producto.id).subscribe({
        next: (item) => {
          this.rating = item.data.puntajePromedio ?? 0;
          this.flagStatus = true;
        }
      });

      this._reviewService.getReviewsDeProducto(this.producto.id).subscribe({
        next: (item) => {
          this.reviewsCount = item.data.length ?? 0;
        }
      });
    }
  }

  get fullStars(): number[] {
    return Array(Math.floor(this.rating)).fill(0);
  }

  get emptyStars(): number[] {
     if (this.rating % 1 !== 0){
      return Array(5 - Math.floor(this.rating) - 1).fill(0);
     }
    return Array(5 - Math.floor(this.rating)).fill(0);
  }

  get halfStars(): number[] {
  if (this.rating != null && this.rating % 1 !== 0) {
    return [0];
  }
  return [];
}

}
