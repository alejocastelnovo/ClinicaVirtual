import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisDatosComponent } from './mis-datos.component';

describe('MisDatosComponent', () => {
  let component: MisDatosComponent;
  let fixture: ComponentFixture<MisDatosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MisDatosComponent]
    });
    fixture = TestBed.createComponent(MisDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
