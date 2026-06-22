import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule } from 'primeng/accordion';
import { TreeSelectModule } from 'primeng/treeselect';
import { ButtonModule } from 'primeng/button';
import { FilterField } from '@/app/core/models/common/filtro.model';
import { BOOLEAN_OPTIONS } from '@/app/core/models/common/select.option.model';

@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, AccordionModule,
    InputTextModule, SelectModule, DatePickerModule,
    InputNumberModule, MultiSelectModule, TreeSelectModule
  ],
  templateUrl: './filtros.html',
})
export class FiltrosComponent implements OnInit {
  @Output() exportar = new EventEmitter<{ formato: 'excel' | 'pdf'; filtros: any; }>();
  @Output() buscar = new EventEmitter<any>();
  @Output() limpiar = new EventEmitter<void>();
  @Input() fields: FilterField[] = [];
  @Input() titulo = 'Elementos';
  @Input() text = 'Contenido';
  @Input() acordeon = false;
  @Input() abierto = true;
  @Input() mostrarExportar = false;
  @Input() icono = 'pi pi-filter';

  filtrosForm!: FormGroup;
  readonly booleanOptions = BOOLEAN_OPTIONS;
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    const controls: Record<string, any> = {};
    this.fields.forEach(f => { controls[String(f.key)] = [null]; });
    this.filtrosForm = this.fb.group(controls);
    this.configurarValidacionFechas();
  }

  get cantidadFiltros(): number {
    return this.fields.length;
  }

  onBuscar(): void {
    const valores = this.filtrosForm.getRawValue();
    this.fields.forEach(field => {
      if (field.type === 'date' && valores[field.key as string]) {
        const fecha = new Date(valores[field.key as string]);
        if (field.includeTime) {
          field.endOfDay ? fecha.setHours(23, 59, 59, 999) : fecha.setHours(0, 0, 0, 0);
          valores[field.key as string] = this.formatDate(fecha);
        } else {
          valores[field.key as string] = fecha.toISOString().split('T')[0];
        }
      }
    });
    this.buscar.emit(valores);
  }

  onLimpiar(): void {
    this.filtrosForm.reset();
    this.limpiar.emit();
  }

  onExportar(formato: 'excel' | 'pdf'): void {
    const valores = this.filtrosForm.getRawValue();
    this.exportar.emit({ formato, filtros: valores });
  }

  obtenerMinDate(field: FilterField): Date | null {
    const fechas = this.fields.filter(f => f.type === 'date');
    if (fechas.length !== 2) return null;
    if (String(field.key) === String(fechas[1].key))
      return this.filtrosForm.get(String(fechas[0].key))?.value ?? null;
    return null;
  }

  obtenerMaxDate(field: FilterField): Date | null {
    const fechas = this.fields.filter(f => f.type === 'date');
    if (fechas.length !== 2) return null;
    if (String(field.key) === String(fechas[0].key))
      return this.filtrosForm.get(String(fechas[1].key))?.value ?? null;
    return null;
  }

  private configurarValidacionFechas(): void {
    const fechas = this.fields.filter(f => f.type === 'date');
    if (fechas.length !== 2) return;
    const ini = this.filtrosForm.get(String(fechas[0].key));
    const fin = this.filtrosForm.get(String(fechas[1].key));
    ini?.valueChanges.subscribe(v => {
      if (v && fin?.value && new Date(v) > new Date(fin.value)) fin.setValue(null, { emitEvent: false });
    });
    fin?.valueChanges.subscribe(v => {
      if (v && ini?.value && new Date(v) < new Date(ini.value)) ini.setValue(null, { emitEvent: false });
    });
  }

  private formatDate(date: Date): string {
    const p = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`;
  }
}