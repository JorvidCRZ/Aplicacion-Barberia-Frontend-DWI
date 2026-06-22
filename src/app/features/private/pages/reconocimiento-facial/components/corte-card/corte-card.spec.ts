import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorteCard } from './corte-card';

describe('CorteCard', () => {
  let component: CorteCard;
  let fixture: ComponentFixture<CorteCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorteCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorteCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
