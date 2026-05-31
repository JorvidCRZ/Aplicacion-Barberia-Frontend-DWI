import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableUsers } from './table-users';

describe('TableUsers', () => {
  let component: TableUsers;
  let fixture: ComponentFixture<TableUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
