import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ClienteFilterCriteria, ClienteFilterMode } from '@/app/core/models/gestion/cliente/cliente-filter.model';

@Component({
  selector: 'app-filtrar-clients',
  standalone: true,
  imports: [NgClass, ButtonModule],
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

  // ── Dropdown state ──
  dropdownOpen = false;
  selectedOrderLabel = 'Todos los clientes';

  readonly orderOptions = [
    { value: 'todos',     label: 'Todos los clientes' },
    { value: 'recientes', label: 'Recientes'           },
    { value: 'mes',       label: 'Este mes'            },
    { value: 'anio',      label: 'Este año'            },
  ] as const;

  readonly months = [
    { value: 1,  label: 'Enero'      },
    { value: 2,  label: 'Febrero'    },
    { value: 3,  label: 'Marzo'      },
    { value: 4,  label: 'Abril'      },
    { value: 5,  label: 'Mayo'       },
    { value: 6,  label: 'Junio'      },
    { value: 7,  label: 'Julio'      },
    { value: 8,  label: 'Agosto'     },
    { value: 9,  label: 'Septiembre' },
    { value: 10, label: 'Octubre'    },
    { value: 11, label: 'Noviembre'  },
    { value: 12, label: 'Diciembre'  },
  ] as const;

  readonly years = this.buildYears();

  draftYear: number | null = this.selectedYear;
  draftMonth: number | null = this.selectedMonth;
  draftFromDate: string = this.fromDate;
  draftToDate: string = this.toDate;

  get isCustomMode(): boolean {
    return this.activeFilter === 'personalizado';
  }

  // ── Dropdown ──
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select-wrap')) {
      this.dropdownOpen = false;
    }
  }

  selectOrder(opt: { value: string; label: string }): void {
    this.selectedOrderLabel = opt.label;
    this.dropdownOpen = false;
    this.selectFilter(opt.value as ClienteFilterMode);
  }

  // ── Filtros ──
  selectFilter(filter: ClienteFilterMode): void {
    this.activeFilter = filter;

    if (filter === 'personalizado') {
      this.customModeChange.emit(true);
      this.syncDraftFromApplied();
      return;
    }

    this.customModeChange.emit(false);
    this.emitFilter();
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
    this.selectedOrderLabel = 'Todos los clientes';
    this.customModeChange.emit(false);
    this.emitFilter();
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
    const current = new Date().getFullYear();
    return Array.from({ length: 8 }, (_, i) => current - i);
  }
}