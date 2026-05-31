import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosBasicosPerfilUsuario } from './datos-basicos-perfil-usuario';

describe('DatosBasicosPerfilUsuario', () => {
  let component: DatosBasicosPerfilUsuario;
  let fixture: ComponentFixture<DatosBasicosPerfilUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosBasicosPerfilUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosBasicosPerfilUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
