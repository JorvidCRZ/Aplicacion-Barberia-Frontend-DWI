import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableClient } from './table-client';

describe('TableClient', () => {
  let component: TableClient;
  let fixture: ComponentFixture<TableClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
