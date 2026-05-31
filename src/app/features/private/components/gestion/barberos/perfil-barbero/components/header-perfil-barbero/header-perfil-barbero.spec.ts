import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPerfilBarbero } from './header-perfil-barbero';

describe('HeaderPerfilBarbero', () => {
  let component: HeaderPerfilBarbero;
  let fixture: ComponentFixture<HeaderPerfilBarbero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderPerfilBarbero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderPerfilBarbero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
