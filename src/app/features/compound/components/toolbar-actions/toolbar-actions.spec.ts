import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarActions } from './toolbar-actions';

describe('ToolbarActions', () => {
  let component: ToolbarActions;
  let fixture: ComponentFixture<ToolbarActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
