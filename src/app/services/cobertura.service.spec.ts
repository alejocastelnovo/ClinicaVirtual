import { TestBed } from '@angular/core/testing';

import { CoberturaService } from './cobertura.service';

describe('CoberturaService', () => {
  let service: CoberturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoberturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
