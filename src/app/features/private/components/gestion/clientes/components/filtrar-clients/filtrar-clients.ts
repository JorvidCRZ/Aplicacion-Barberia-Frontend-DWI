import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClienteFilterCriteria, ClienteFilterMode } from '@/app/core/models/gestion/cliente/cliente-filter.model';

@Component({
  selector: 'app-filtrar-clients',
  standalone: true,
  imports: [],
  templateUrl: './filtrar-clients.html',
  styleUrl: './filtrar-clients.css',
})
export class FiltrarClients {
  @Input() activeFilter: ClienteFilterMode = 'todos';
  @Input() selectedYear: number | null = new Date().getFullYear();
  @Input() selectedMonth: number | null = new Date().getMonth() + 1;
  @Input() fromDate: string = '';
  @Input() toDate: string = '';

  @Output() filterChange = new EventEmitter<ClienteFilterCriteria>();
  @Output() customModeChange = new EventEmitter<boolean>();

  readonly filters = [
    { key: 'todos', label: 'Todos', subtitle: 'Clientes registrados' },
    { key: 'recientes', label: 'Recientes', subtitle: 'Alta reciente' },
    { key: 'mes', label: 'Este mes', subtitle: 'Actividad mensual' },
    { key: 'anio', label: 'Este año', subtitle: 'Resumen anual' },
    { key: 'personalizado', label: 'Personalizado', subtitle: 'Mes, año o rango' },
    { key: 'deshabilitados', label: 'Deshabilitados', subtitle: 'Clientes inactivos' },
  ] as const;

  readonly months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ] as const;

  readonly years = this.buildYears();

  draftYear: number | null = this.selectedYear;
  draftMonth: number | null = this.selectedMonth;
  draftFromDate: string = this.fromDate;
  draftToDate: string = this.toDate;

  get isCustomMode(): boolean {
    return this.activeFilter === 'personalizado';
  }

  selectFilter(filter: ClienteFilterMode) {
    this.activeFilter = filter;

    if (filter !== 'personalizado') {
      this.customModeChange.emit(false);
      this.emitFilter();
      return;
    }

    this.customModeChange.emit(true);
    this.syncDraftFromApplied();
  }

  onYearChange(value: string): void {
    this.draftYear = value ? Number(value) : null;
  }

  onMonthChange(value: string): void {
    this.draftMonth = value ? Number(value) : null;
  }

  onFromDateChange(value: string): void {
    this.draftFromDate = value;
  }

  onToDateChange(value: string): void {
    this.draftToDate = value;
  }

  buscarPersonalizado(): void {
    this.activeFilter = 'personalizado';
    this.customModeChange.emit(true);
    this.selectedYear = this.draftYear;
    this.selectedMonth = this.draftMonth;
    this.fromDate = this.draftFromDate;
    this.toDate = this.draftToDate;
    this.emitFilter();
  }

  limpiarPersonalizado(): void {
    this.draftYear = this.selectedYear = this.buildYears()[0];
    this.draftMonth = this.selectedMonth = new Date().getMonth() + 1;
    this.draftFromDate = this.fromDate = '';
    this.draftToDate = this.toDate = '';
    this.activeFilter = 'todos';
    this.customModeChange.emit(false);
    this.emitFilter();
  }

  canUseQuickFilters(): boolean {
    return !this.isCustomMode;
  }

  isQuickFilterDisabled(filter: ClienteFilterMode): boolean {
    return this.isCustomMode && filter !== 'personalizado';
  }

  trackYear = (_index: number, year: number) => year;

  trackMonth = (_index: number, month: { value: number; label: string }) => month.value;

  private emitFilter(): void {
    this.filterChange.emit({
      mode: this.activeFilter,
      year: this.selectedYear,
      month: this.selectedMonth,
      fromDate: this.fromDate,
      toDate: this.toDate,
    });
  }

  private syncDraftFromApplied(): void {
    this.draftYear = this.selectedYear;
    this.draftMonth = this.selectedMonth;
    this.draftFromDate = this.fromDate;
    this.draftToDate = this.toDate;
  }

  private buildYears(): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 8 }, (_, index) => currentYear - index);
  }

}
