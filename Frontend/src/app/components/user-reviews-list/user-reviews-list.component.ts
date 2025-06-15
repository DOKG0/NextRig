import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReviewItemComponent } from '../review-item/review-item.component';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../interfaces/review';
import { ResponseReviews } from '../../interfaces/response-reviews';
import { Router, RouterLink } from '@angular/router';

@Component({
	selector: 'app-user-reviews-list',
	imports: [CommonModule, ReviewItemComponent, RouterLink],
	templateUrl: './user-reviews-list.component.html',
	styleUrl: './user-reviews-list.component.css'
})
export class UserReviewsListComponent implements OnInit {
	private reviewHttpService: ReviewService = inject(ReviewService);
	private router: Router = inject(Router);
	private currentUsername!: string;
	public reviews: Review[] = [];
	
	ngOnInit(): void {
		this.currentUsername = this.getLoggedUsername();

		if (!this.currentUsername) {
			this.router.navigate(['/login']);
		} else {
			this.fetchReviews()
		}
	}

	getLoggedUsername(): string {
		const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
		const username = user?.username || "";

		return username;
	}

	fetchReviews(): void {
		this.reviewHttpService.getReviewsDeUsuario(this.currentUsername).subscribe({
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
