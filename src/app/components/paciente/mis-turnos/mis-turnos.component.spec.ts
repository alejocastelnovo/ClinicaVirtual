import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisTurnosComponent } from './mis-turnos.component';

describe('MisTurnosComponent', () => {
  let component: MisTurnosComponent;
  let fixture: ComponentFixture<MisTurnosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MisTurnosComponent]
    });
    fixture = TestBed.createComponent(MisTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
