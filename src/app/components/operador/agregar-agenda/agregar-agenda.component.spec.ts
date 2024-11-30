import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarAgendaComponent } from './agregar-agenda.component';

describe('AgregarAgendaComponent', () => {
  let component: AgregarAgendaComponent;
  let fixture: ComponentFixture<AgregarAgendaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgregarAgendaComponent]
    });
    fixture = TestBed.createComponent(AgregarAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
