import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaskListDialogComponent } from './edit-task-list-dialog.component';

describe('EditTaskListDialogComponent', () => {
  let component: EditTaskListDialogComponent;
  let fixture: ComponentFixture<EditTaskListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTaskListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaskListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
