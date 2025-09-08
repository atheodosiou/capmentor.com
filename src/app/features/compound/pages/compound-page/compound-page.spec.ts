import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundPage } from './compound-page';

describe('CompoundPage', () => {
  let component: CompoundPage;
  let fixture: ComponentFixture<CompoundPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompoundPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompoundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
