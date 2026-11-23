import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesLayoutComponent } from './features-layout.component';

describe('FeaturesLayoutComponent', () => {
  let component: FeaturesLayoutComponent;
  let fixture: ComponentFixture<FeaturesLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturesLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
