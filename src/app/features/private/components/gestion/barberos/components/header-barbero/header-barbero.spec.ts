import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBarbero } from './header-barbero';

describe('HeaderBarbero', () => {
  let component: HeaderBarbero;
  let fixture: ComponentFixture<HeaderBarbero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderBarbero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderBarbero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
