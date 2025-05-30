import { Component, inject, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-review-list',
  imports: [],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.css'
})
export class ReviewListComponent implements OnInit {
  private reviewHttpService: ReviewService = inject(ReviewService);

  ngOnInit(): void {  }
}
