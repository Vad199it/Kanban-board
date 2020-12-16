import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelListProjectComponent } from './label-list-project.component';

describe('LabelListProjectComponent', () => {
  let component: LabelListProjectComponent;
  let fixture: ComponentFixture<LabelListProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelListProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelListProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
