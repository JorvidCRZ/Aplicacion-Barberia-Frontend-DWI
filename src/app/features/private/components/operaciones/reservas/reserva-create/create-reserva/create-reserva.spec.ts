import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReserva } from './create-reserva';

describe('CreateReserva', () => {
  let component: CreateReserva;
  let fixture: ComponentFixture<CreateReserva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateReserva]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateReserva);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
