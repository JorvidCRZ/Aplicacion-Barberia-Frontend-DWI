import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderUsuario } from './header-usuario';

describe('HeaderUsuario', () => {
  let component: HeaderUsuario;
  let fixture: ComponentFixture<HeaderUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
