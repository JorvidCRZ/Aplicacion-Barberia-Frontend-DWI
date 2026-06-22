import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaCalendar } from './reserva-calendar';

describe('ReservaCalendar', () => {
  let component: ReservaCalendar;
  let fixture: ComponentFixture<ReservaCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
