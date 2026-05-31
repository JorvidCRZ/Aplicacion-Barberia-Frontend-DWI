import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilBarbero } from './perfil-barbero';

describe('PerfilBarbero', () => {
  let component: PerfilBarbero;
  let fixture: ComponentFixture<PerfilBarbero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilBarbero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilBarbero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
