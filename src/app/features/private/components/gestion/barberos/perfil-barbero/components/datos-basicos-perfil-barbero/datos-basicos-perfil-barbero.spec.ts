import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosBasicosPerfilBarbero } from './datos-basicos-perfil-barbero';

describe('DatosBasicosPerfilBarbero', () => {
  let component: DatosBasicosPerfilBarbero;
  let fixture: ComponentFixture<DatosBasicosPerfilBarbero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosBasicosPerfilBarbero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosBasicosPerfilBarbero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
