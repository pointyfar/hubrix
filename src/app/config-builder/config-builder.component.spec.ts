import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigBuilderComponent } from './config-builder.component';

describe('ConfigBuilderComponent', () => {
  let component: ConfigBuilderComponent;
  let fixture: ComponentFixture<ConfigBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
