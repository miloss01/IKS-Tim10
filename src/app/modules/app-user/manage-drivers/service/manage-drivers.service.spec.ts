import { TestBed } from '@angular/core/testing';

import { ManageDriversService } from './manage-drivers.service';

describe('ManageDriversService', () => {
  let service: ManageDriversService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageDriversService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
