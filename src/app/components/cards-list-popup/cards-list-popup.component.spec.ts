import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsListPopupComponent } from './cards-list-popup.component';

describe('CardsListPopupComponent', () => {
  let component: CardsListPopupComponent;
  let fixture: ComponentFixture<CardsListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsListPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
