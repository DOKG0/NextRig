import { Component, inject, Input, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ReviewStarsRadioComponent } from '../review-stars-radio/review-stars-radio.component';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../interfaces/review';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-review-form',
	imports: [ReactiveFormsModule, ReviewStarsRadioComponent],
	templateUrl: './review-form.component.html',
	styleUrl: './review-form.component.css',
})
export class ReviewFormComponent implements OnInit {
	private reviewService: ReviewService = inject(ReviewService);
	private formBuilder: FormBuilder = inject(FormBuilder);
	public reviewFormGroup!: FormGroup;

	@Input() username!: string;
	@Input() productId!: string;

	ngOnInit(): void {
		this.createFormInstance();
	}

	createFormInstance(): void {
		const group: any = {};
		group['username'] = new FormControl({ value: this.username, disabled: true });
		group['idProducto'] = new FormControl({ value: this.productId, disabled: true});
		group['puntaje'] = new FormControl({ value: 5, disabled: false });
		
		const mensajeFormControl = new FormControl();
		mensajeFormControl.addValidators(Validators.required);
		mensajeFormControl.addValidators(Validators.maxLength(250));
		mensajeFormControl.addValidators(Validators.pattern(new RegExp(/[\S]/g)));

		group['mensaje'] = mensajeFormControl;

		this.reviewFormGroup = this.formBuilder.group(group);
	}

	getInputValidationClass(controlName: string): string {

		const isTouched: boolean = this.reviewFormGroup?.get(controlName)?.touched || false;
		const isDirty: boolean = this.reviewFormGroup?.get(controlName)?.dirty || false;
		const isValid: boolean = this.reviewFormGroup?.get(controlName)?.valid || false;

		if (isValid) {
			return 'is-valid';
		}

		if (!isValid && (isTouched || isDirty)) {
			return 'is-invalid';
		}

		return '';
	}

	onFormSubmit(): void {
		if (this.reviewFormGroup.valid) {
			const formContent: Review = this.reviewFormGroup.getRawValue();
			this.reviewService.postReview(formContent).subscribe({
				next: (response) => {
					this.alertSuccessfulCreation();
				},
				error: (err) => {
					this.alertFailedCreation(err.error.error)
				}
			});
		} else {
			this.alertInvalidForm()
		}
	}

	alertSuccessfulCreation(): void {
		Swal.fire({
			title: 'Reseña creada exitosamente',
			text: 'Gracias por calificar el producto',
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
			title: 'Ocurrió un error al crear la reseña',
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

	alertInvalidForm(): void {
		Swal.fire({
			title: 'El formulario está incompleto o tiene información inválida',
			text: 'Por favor complete el formulario.',
			icon: 'error',
			showCloseButton: true,
			confirmButtonText: 'Aceptar',
			showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOut animate__faster'
              }
		});
	}
}
