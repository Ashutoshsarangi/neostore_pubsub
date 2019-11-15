import { TestBed } from '@angular/core/testing';
import { BehaviourService } from './behaviour.service';

describe('BehaviourService', () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BehaviourService = TestBed.get(BehaviourService);
    expect(service).toBeTruthy();
  });

});