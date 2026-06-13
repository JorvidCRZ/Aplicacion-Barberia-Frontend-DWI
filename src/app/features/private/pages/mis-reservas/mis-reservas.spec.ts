import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';



@Component({ selector: 'app-mis-reservas', template: '' })
class MisReservas {}

describe('MisReservas', () => {
  let component: MisReservas;
  let fixture: ComponentFixture<MisReservas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MisReservas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisReservas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
