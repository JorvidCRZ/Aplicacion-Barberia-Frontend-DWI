import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Resumen } from './resumen';

describe('Resumen', () => {
  let component: Resumen;
  let fixture: ComponentFixture<Resumen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Resumen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Resumen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
