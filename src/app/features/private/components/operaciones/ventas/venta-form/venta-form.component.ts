import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';

import { ClienteService } from '@/app/core/services/gestion/cliente.service';
import { ProductoService } from '@/app/core/services/catalogos/producto.service';
import { ServicioService } from '@/app/core/services/catalogos/servicio.service';

interface DetalleProductoValue {
  itemId: number;
  cantidad: number;
  precioUnitario: number;
}

interface DetalleServicioValue {
  itemId: number;
  precio: number;
}

@Component({
  selector: 'app-venta-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    MessageModule,
    SelectModule,
    InputNumberModule,
    TooltipModule,
    TagModule
  ],
  templateUrl: './venta-form.html'
})
export class VentaFormComponent implements OnInit, OnChanges {

  @Input() venta: any = null;
  @Input() isEditMode: boolean = false;

  @Output() guardar = new EventEmitter<any>();
  @Output() cancelarEvento = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private productoService = inject(ProductoService);
  private servicioService = inject(ServicioService);

  clientes: any[] = [];
  productos: any[] = [];
  servicios: any[] = [];

  tiposComprobante = [
    { label: 'Boleta', value: 'BOLETA' },
    { label: 'Factura', value: 'FACTURA' }
  ];

  ventaForm: FormGroup = this.fb.group({
    clienteId: [null, Validators.required],
    tipoComprobante: ['BOLETA', Validators.required],
    productosDetalles: this.fb.array([]),
    serviciosDetalles: this.fb.array([])
  });

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['venta'] && this.venta && this.isEditMode) {
      this.cargarVentaParaEditar();
    }
    if (changes['isEditMode'] && this.isEditMode) {
      this.bloquearTodoElFormulario();
    }
  }

  cargarDatosIniciales(): void {
    this.clienteService.listar(0, 100).subscribe({
      next: (resp) => { this.clientes = resp.data.content || []; },
      error: () => { this.clientes = []; }
    });

    this.productoService.obtenerProductos(0, 100).subscribe({
      next: (resp: any) => { this.productos = resp.data.content || []; },
      error: () => { this.productos = []; }
    });

    this.servicioService.obtenerServiciosConFiltro({ page: 0, size: 100 } as any).subscribe({
      next: (resp: any) => { this.servicios = resp.data.content || []; },
      error: () => { this.servicios = []; }
    });

    if (!this.isEditMode) {
      this.limpiarFormulario();
    }
  }

  cargarVentaParaEditar(): void {
    if (!this.venta) return;

    this.ventaForm.patchValue({
      clienteId: this.venta.clienteId,
      tipoComprobante: this.venta.tipoComprobante
    });

    this.productosDetalles.clear();
    this.serviciosDetalles.clear();

    if (this.venta.detalles?.length > 0) {
      this.venta.detalles.forEach((detalle: any) => {
        if (detalle.servicioId) {
          const detalleForm = this.crearServicioForm();
          detalleForm.patchValue({
            itemId: detalle.servicioId,
            precio: detalle.precioUnitario
          });
          this.serviciosDetalles.push(detalleForm);
        } else {
          const detalleForm = this.crearProductoForm();
          detalleForm.patchValue({
            itemId: detalle.productoId,
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precioUnitario
          });
          this.productosDetalles.push(detalleForm);
        }
      });
    }

    this.bloquearTodoElFormulario();
  }

  bloquearTodoElFormulario(): void {
    this.ventaForm.disable();
  }

  get productosDetalles(): FormArray {
    return this.ventaForm.get('productosDetalles') as FormArray;
  }

  get serviciosDetalles(): FormArray {
    return this.ventaForm.get('serviciosDetalles') as FormArray;
  }

  get total(): number {
    const totalProd = this.productosDetalles.controls.reduce((acc, control) => {
      return acc + (Number(control.get('cantidad')?.value || 0) * Number(control.get('precioUnitario')?.value || 0));
    }, 0);
    const totalServ = this.serviciosDetalles.controls.reduce((acc, control) => {
      return acc + Number(control.get('precio')?.value || 0);
    }, 0);

    return totalProd + totalServ;
  }

  get subtotalGeneral(): number {
    return this.total / 1.18;
  }

  get igv(): number {
    return this.total - this.subtotalGeneral;
  }

  getNombreCliente(): string {
    const clienteId = this.ventaForm.getRawValue().clienteId;
    const cliente = this.clientes.find(c => c.clienteId === clienteId);
    if (!cliente) return '—';
    const { nombre = '', apellido = '' } = cliente.persona ?? {};
    return `${nombre} ${apellido}`.trim() || '—';
  }

  getLabelComprobante(): string {
    const value = this.ventaForm.getRawValue().tipoComprobante;
    const tipo = this.tiposComprobante.find(t => t.value === value);
    return tipo?.label ?? value ?? '—';
  }

  getNombreProducto(index: number): string {
    const itemId = this.productosDetalles.at(index).get('itemId')?.value;
    const producto = this.productos.find(p => Number(p.id) === Number(itemId));
    return producto?.nombre ?? '—';
  }

  getNombreServicio(index: number): string {
    const itemId = this.serviciosDetalles.at(index).get('itemId')?.value;
    const servicio = this.servicios.find(s => Number(s.servicioId) === Number(itemId));
    return servicio?.nombre ?? '—';
  }

  crearProductoForm(): FormGroup {
    const detalleForm = this.fb.group({
      itemId: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]]
    });

    if (!this.isEditMode) {
      detalleForm.get('itemId')?.valueChanges.subscribe((itemId) => {
        const producto = this.productos.find(p => Number(p.id) === Number(itemId));
        detalleForm.patchValue({
          precioUnitario: producto ? Number(producto.precio || 0) : 0,
          cantidad: 1
        }, { emitEvent: false });
      });
    }
    return detalleForm;
  }

  agregarProductoVacio(): void {
    if (this.isEditMode) return;
    this.productosDetalles.push(this.crearProductoForm());
  }

  eliminarProducto(index: number): void {
    if (this.isEditMode) return;
    this.productosDetalles.removeAt(index);
  }

  actualizarPrecioProducto(index: number): void {
    if (this.isEditMode) return;
    const detalle = this.productosDetalles.at(index);
    const itemId = detalle.get('itemId')?.value;
    const producto = this.productos.find(p => Number(p.id) === Number(itemId));
    detalle.patchValue({
      precioUnitario: producto ? Number(producto.precio || 0) : 0,
      cantidad: 1
    }, { emitEvent: false });
  }

  getMaxStockProducto(index: number): number {
    const itemId = this.productosDetalles.at(index).get('itemId')?.value;
    const producto = this.productos.find(p => Number(p.id) === Number(itemId));
    if (!producto) return 12;
    return Math.min(Number(producto.stock || 0), 12);
  }

  getSubtotalLineaProducto(index: number): number {
    const detalle = this.productosDetalles.at(index);
    const cantidad = Number(detalle.get('cantidad')?.value || 0);
    const precio = Number(detalle.get('precioUnitario')?.value || 0);
    return cantidad * precio;
  }

  crearServicioForm(): FormGroup {
    return this.fb.group({
      itemId: [null, Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]]
    });
  }

  agregarServicioVacio(): void {
    if (this.isEditMode) return;
    this.serviciosDetalles.push(this.crearServicioForm());
  }

  eliminarServicio(index: number): void {
    if (this.isEditMode) return;
    this.serviciosDetalles.removeAt(index);
  }

  actualizarPrecioServicio(index: number): void {
    if (this.isEditMode) return;
    const detalle = this.serviciosDetalles.at(index);
    const itemId = detalle.get('itemId')?.value;
    const servicio = this.servicios.find(s => Number(s.servicioId) === Number(itemId)); // <-- CAMBIO AQUÍ
    detalle.patchValue({ precio: servicio ? Number(servicio.precio || 0) : 0 }, { emitEvent: false });
  }

  guardarVenta(): void {
    if (this.isEditMode) return;

    if (this.ventaForm.invalid || (this.productosDetalles.length === 0 && this.serviciosDetalles.length === 0)) {
      this.ventaForm.markAllAsTouched();
      return;
    }

    const formValue = this.ventaForm.getRawValue();

    const payload = {
      clienteId: formValue.clienteId,
      fecha: new Date(),
      tipoComprobante: formValue.tipoComprobante,
      detalles: [
        ...formValue.productosDetalles.map((d: DetalleProductoValue) => ({
          productoId: d.itemId,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario
        })),
        ...formValue.serviciosDetalles.map((d: DetalleServicioValue) => ({
          servicioId: d.itemId,
          cantidad: 1,
          precioUnitario: d.precio
        }))
      ]
    };

    this.guardar.emit(payload);
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.ventaForm.reset({
      clienteId: null,
      tipoComprobante: 'BOLETA'
    });
    this.productosDetalles.clear();
    this.serviciosDetalles.clear();
    this.agregarProductoVacio();
  }
}