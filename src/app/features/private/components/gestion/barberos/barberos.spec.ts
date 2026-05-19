import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Barberos } from './barberos';

describe('Barberos', () => {
  let component: Barberos;
  let fixture: ComponentFixture<Barberos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Barberos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Barberos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
