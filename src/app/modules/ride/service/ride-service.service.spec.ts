import { TestBed } from '@angular/core/testing';

import { RideServiceService } from './ride-service.service';

describe('RideServiceService', () => {
  let service: RideServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
