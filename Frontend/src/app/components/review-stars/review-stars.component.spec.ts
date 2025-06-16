import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewStarsComponent } from './review-stars.component';

describe('ReviewStarsComponent', () => {
  let component: ReviewStarsComponent;
  let fixture: ComponentFixture<ReviewStarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewStarsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewStarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
