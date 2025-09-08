import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsKpis } from './results-kpis';

describe('ResultsKpis', () => {
  let component: ResultsKpis;
  let fixture: ComponentFixture<ResultsKpis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsKpis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsKpis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
