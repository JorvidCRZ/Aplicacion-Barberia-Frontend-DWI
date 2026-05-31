import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableBarbero } from './table-barbero';

describe('TableBarbero', () => {
  let component: TableBarbero;
  let fixture: ComponentFixture<TableBarbero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableBarbero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableBarbero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
