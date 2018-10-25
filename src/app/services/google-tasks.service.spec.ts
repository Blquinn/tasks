import { TestBed, inject } from '@angular/core/testing';

import { GoogleTasksService } from './google-tasks.service';

describe('GoogleTasksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleTasksService]
    });
  });

  it('should be created', inject([GoogleTasksService], (service: GoogleTasksService) => {
    expect(service).toBeTruthy();
  }));
});
