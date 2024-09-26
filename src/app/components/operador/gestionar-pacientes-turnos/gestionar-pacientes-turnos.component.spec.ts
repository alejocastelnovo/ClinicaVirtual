import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarPacientesTurnosComponent } from './gestionar-pacientes-turnos.component';

describe('GestionarPacientesTurnosComponent', () => {
  let component: GestionarPacientesTurnosComponent;
  let fixture: ComponentFixture<GestionarPacientesTurnosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionarPacientesTurnosComponent]
    });
    fixture = TestBed.createComponent(GestionarPacientesTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
