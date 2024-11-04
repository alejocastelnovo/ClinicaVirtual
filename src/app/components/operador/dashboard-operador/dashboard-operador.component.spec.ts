import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOperadorComponent } from './dashboard-operador.component';

describe('DashboardOperadorComponent', () => {
  let component: DashboardOperadorComponent;
  let fixture: ComponentFixture<DashboardOperadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardOperadorComponent]
    });
    fixture = TestBed.createComponent(DashboardOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
