import { TestBed } from '@angular/core/testing';

import { RideHistoryServiceService } from './ride-history-service.service';

describe('RideHistoryServiceService', () => {
  let service: RideHistoryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideHistoryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
