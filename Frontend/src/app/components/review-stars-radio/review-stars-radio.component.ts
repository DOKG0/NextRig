import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-stars-radio',
  imports: [ ReactiveFormsModule ],
  templateUrl: './review-stars-radio.component.html',
  styleUrl: './review-stars-radio.component.css'
})
export class ReviewStarsRadioComponent {
  @Input() reviewFormGroup!: FormGroup;

}
