import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FusionsComponent } from './fusions.component';

describe('FusionsComponent', () => {
  let component: FusionsComponent;
  let fixture: ComponentFixture<FusionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FusionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FusionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
