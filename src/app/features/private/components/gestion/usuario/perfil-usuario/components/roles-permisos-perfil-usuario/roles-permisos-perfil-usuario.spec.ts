import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesPermisosPerfilUsuario } from './roles-permisos-perfil-usuario';

describe('RolesPermisosPerfilUsuario', () => {
  let component: RolesPermisosPerfilUsuario;
  let fixture: ComponentFixture<RolesPermisosPerfilUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesPermisosPerfilUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesPermisosPerfilUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
