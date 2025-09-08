import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyTicker } from './currency-ticker';

describe('CurrencyTicker', () => {
  let component: CurrencyTicker;
  let fixture: ComponentFixture<CurrencyTicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyTicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyTicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
