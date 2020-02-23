import { TestBed } from '@angular/core/testing';

import { AuthentiationserviceService } from './authentiationservice.service';

describe('AuthentiationserviceService', () => {
  let service: AuthentiationserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthentiationserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
