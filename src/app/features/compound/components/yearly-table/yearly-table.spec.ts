import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyTable } from './yearly-table';

describe('YearlyTable', () => {
  let component: YearlyTable;
  let fixture: ComponentFixture<YearlyTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearlyTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearlyTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
