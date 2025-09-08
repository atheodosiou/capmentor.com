import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyChart } from './yearly-chart';

describe('YearlyChart', () => {
  let component: YearlyChart;
  let fixture: ComponentFixture<YearlyChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearlyChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearlyChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
