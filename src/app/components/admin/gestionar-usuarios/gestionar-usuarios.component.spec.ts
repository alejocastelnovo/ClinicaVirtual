import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarUsuariosComponent } from './gestionar-usuarios.component';

describe('GestionarUsuariosComponent', () => {
  let component: GestionarUsuariosComponent;
  let fixture: ComponentFixture<GestionarUsuariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionarUsuariosComponent]
    });
    fixture = TestBed.createComponent(GestionarUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
