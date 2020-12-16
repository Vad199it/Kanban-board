import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelListTaskComponent } from './label-list-task.component';

describe('LabelListTaskComponent', () => {
  let component: LabelListTaskComponent;
  let fixture: ComponentFixture<LabelListTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelListTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelListTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
