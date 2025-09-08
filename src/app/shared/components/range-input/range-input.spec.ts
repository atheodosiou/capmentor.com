import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeInput } from './range-input';

describe('RangeInput', () => {
  let component: RangeInput;
  let fixture: ComponentFixture<RangeInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangeInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
