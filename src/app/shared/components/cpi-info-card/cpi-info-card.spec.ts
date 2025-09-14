import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpiInfoCard } from './cpi-info-card';

describe('CpiInfoCard', () => {
  let component: CpiInfoCard;
  let fixture: ComponentFixture<CpiInfoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CpiInfoCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpiInfoCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
