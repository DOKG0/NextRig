import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcasCarrouselComponent } from './marcas-carrousel.component';

describe('MarcasCarrouselComponent', () => {
  let component: MarcasCarrouselComponent;
  let fixture: ComponentFixture<MarcasCarrouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcasCarrouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcasCarrouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
