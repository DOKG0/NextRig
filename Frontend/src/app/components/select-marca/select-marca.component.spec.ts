import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMarcaComponent } from './select-marca.component';

describe('SelectMarcaComponent', () => {
  let component: SelectMarcaComponent;
  let fixture: ComponentFixture<SelectMarcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMarcaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectMarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
