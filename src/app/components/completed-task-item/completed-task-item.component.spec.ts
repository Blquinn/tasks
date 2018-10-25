import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedTaskItemComponent } from './completed-task-item.component';

describe('CompletedTaskItemComponent', () => {
  let component: CompletedTaskItemComponent;
  let fixture: ComponentFixture<CompletedTaskItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedTaskItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedTaskItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
