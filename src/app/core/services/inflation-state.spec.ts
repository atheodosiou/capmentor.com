import { TestBed } from '@angular/core/testing';

import { InflationState } from './inflation-state';

describe('InflationState', () => {
  let service: InflationState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InflationState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
