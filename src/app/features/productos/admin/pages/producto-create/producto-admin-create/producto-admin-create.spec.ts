import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoAdminCreate } from './producto-admin-create';

describe('ProductoAdminCreate', () => {
  let component: ProductoAdminCreate;
  let fixture: ComponentFixture<ProductoAdminCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoAdminCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoAdminCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
