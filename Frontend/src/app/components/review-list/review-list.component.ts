import { Component, inject, Input, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { Product } from '../../interfaces/product';
import { Review } from '../../interfaces/review';
import { ResponseReviews } from '../../interfaces/response-reviews';
import { CommonModule } from '@angular/common';
import { ReviewItemComponent } from "../review-item/review-item.component";

@Component({
	selector: 'app-review-list',
	imports: [CommonModule, ReviewItemComponent],
	templateUrl: './review-list.component.html',
	styleUrl: './review-list.component.css',
})
export class ReviewListComponent implements OnInit {
	private reviewHttpService: ReviewService = inject(ReviewService);
	public reviews: Review[] = [];
	@Input() public product!: Product;

	ngOnInit(): void {
		if (this.product) {
			this.fetchReviews();
		} else {
			console.error("No se obtuvo la información del producto.");
		}
	}

	fetchReviews(): void {
		this.reviewHttpService.getReviewsDeProducto(this.product.id as string).subscribe({
			next: (response: ResponseReviews) => {
				this.reviews = response.data as Review[];					
			},
			error: (err) => {
				const errorObj: ResponseReviews = err.error;
				console.error(errorObj.mensaje);
			}
		})
	}
}
