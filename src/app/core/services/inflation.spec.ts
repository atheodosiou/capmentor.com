import { TestBed } from '@angular/core/testing';

import { Inflation } from './inflation';

describe('Inflation', () => {
  let service: Inflation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Inflation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
