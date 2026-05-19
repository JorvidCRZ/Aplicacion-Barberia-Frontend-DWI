import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosAdminList } from './productos-admin-list';

describe('ProductosAdminList', () => {
  let component: ProductosAdminList;
  let fixture: ComponentFixture<ProductosAdminList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosAdminList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosAdminList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
