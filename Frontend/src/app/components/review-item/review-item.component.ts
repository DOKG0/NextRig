import { Component, inject, Input, OnInit } from '@angular/core';
import { Review } from '../../interfaces/review';
import { ReviewService } from '../../services/review.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ReviewStarsComponent } from '../review-stars/review-stars.component';


@Component({
	selector: 'app-review-item',
	imports: [ CommonModule, ReviewStarsComponent],
	templateUrl: './review-item.component.html',
	styleUrl: './review-item.component.css'
})
export class ReviewItemComponent implements OnInit {
	private currentUsername!: string;
	private reviewService: ReviewService = inject(ReviewService);
	@Input() public review!: Review;
	public reviewBelongsToCurrentUser: boolean = false;
	flagStatus : boolean = false;

	ngOnInit(): void {
		this.currentUsername = this.getLoggedUsername();
		if (this.review.username === this.currentUsername) {
			this.reviewBelongsToCurrentUser = true;
		}
		this.flagStatus = true;
	}

	getLoggedUsername(): string {
		const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
		const username = user?.username || "";

		return username;
	}

	onClickDeleteReview(): void {
		Swal.fire({
			title: '¿Está seguro que desea eliminar la reseña?',
			icon: 'question',
			confirmButtonText: 'Aceptar',
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOut animate__faster'
              }
		}).then((result) => {
			if (result.isConfirmed) {
				this.sendDeleteRequest();
			}
		});
	}

	sendDeleteRequest(): void {
		this.reviewService
			.deleteReview(this.review.idProducto, this.currentUsername)
			.subscribe({
				next: (response) => {
					this.alertSuccessfulCreation();
				},
				error: (err) => {
					console.error(err.error);
					this.alertFailedCreation(err.error.error);
				}
			})
	}

	alertSuccessfulCreation(): void {
		Swal.fire({
			title: 'Reseña eliminada exitosamente',
			icon: 'success',
			showCloseButton: true,
			confirmButtonText: 'Aceptar',
			showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOut animate__faster'
              }
		}).then(() => {
			location.reload();
		});
	}

	alertFailedCreation(data: string): void {
		Swal.fire({
			title: 'Ocurrió un error al eliminar la reseña',
			text: data,
			icon: 'error',
			showCloseButton: true,
			confirmButtonText: 'Accept',
			showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOut animate__faster'
              }
		});
	}
}
