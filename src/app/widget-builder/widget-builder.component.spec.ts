import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetBuilderComponent } from './widget-builder.component';

describe('WidgetBuilderComponent', () => {
  let component: WidgetBuilderComponent;
  let fixture: ComponentFixture<WidgetBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
