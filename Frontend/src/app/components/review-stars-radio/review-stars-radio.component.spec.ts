import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewStarsRadioComponent } from './review-stars-radio.component';

describe('ReviewStarsRadioComponent', () => {
  let component: ReviewStarsRadioComponent;
  let fixture: ComponentFixture<ReviewStarsRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewStarsRadioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewStarsRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
