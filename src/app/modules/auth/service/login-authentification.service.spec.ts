import { TestBed } from '@angular/core/testing';

import { LoginAuthentificationService } from './login-authentification.service';

describe('LoginAuthentificationService', () => {
  let service: LoginAuthentificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginAuthentificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
