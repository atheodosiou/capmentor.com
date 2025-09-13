import { TestBed } from '@angular/core/testing';

import { Geocountry } from './geocountry';

describe('Geocountry', () => {
  let service: Geocountry;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Geocountry);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
