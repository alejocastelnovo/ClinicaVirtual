import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPacientesDiaComponent } from './lista-pacientes-dia.component';

describe('ListaPacientesDiaComponent', () => {
  let component: ListaPacientesDiaComponent;
  let fixture: ComponentFixture<ListaPacientesDiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaPacientesDiaComponent]
    });
    fixture = TestBed.createComponent(ListaPacientesDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
