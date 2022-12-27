import { TestBed } from '@angular/core/testing';

import { ManagePassengersService } from './manage-passengers.service';

describe('ManagePassengersService', () => {
  let service: ManagePassengersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagePassengersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
