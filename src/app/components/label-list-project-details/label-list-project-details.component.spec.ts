import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelListProjectDetailsComponent } from './label-list-project-details.component';

describe('LabelListProjectDetailsComponent', () => {
  let component: LabelListProjectDetailsComponent;
  let fixture: ComponentFixture<LabelListProjectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelListProjectDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelListProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
