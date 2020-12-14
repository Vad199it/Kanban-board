import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksListDetailsComponent } from './tasks-list-details.component';

describe('TasksListDetailsComponent', () => {
  let component: TasksListDetailsComponent;
  let fixture: ComponentFixture<TasksListDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksListDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
