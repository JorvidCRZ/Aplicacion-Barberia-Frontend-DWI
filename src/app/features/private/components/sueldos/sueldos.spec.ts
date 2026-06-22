import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sueldos } from './sueldos';

describe('Sueldos', () => {
  let component: Sueldos;
  let fixture: ComponentFixture<Sueldos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sueldos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sueldos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
