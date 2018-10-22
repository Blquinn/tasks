import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTaskListDialogComponent } from './delete-task-list-dialog.component';

describe('DeleteTaskListDialogComponent', () => {
  let component: DeleteTaskListDialogComponent;
  let fixture: ComponentFixture<DeleteTaskListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteTaskListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTaskListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
