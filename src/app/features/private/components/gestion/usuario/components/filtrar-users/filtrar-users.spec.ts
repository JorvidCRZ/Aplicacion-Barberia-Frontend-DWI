import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrarUsers } from './filtrar-users';

describe('FiltrarUsers', () => {
  let component: FiltrarUsers;
  let fixture: ComponentFixture<FiltrarUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrarUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrarUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
