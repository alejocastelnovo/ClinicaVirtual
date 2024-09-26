import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoTurnoComponent } from './nuevo-turno.component';

describe('NuevoTurnoComponent', () => {
  let component: NuevoTurnoComponent;
  let fixture: ComponentFixture<NuevoTurnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevoTurnoComponent]
    });
    fixture = TestBed.createComponent(NuevoTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
