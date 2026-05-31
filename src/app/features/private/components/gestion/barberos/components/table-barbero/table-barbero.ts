import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-table-barbero',
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './table-barbero.html',
  styleUrl: './table-barbero.css',
})
export class TableBarbero {

  @Input() barberos: any[] = [];

  @Input() totalElements: number = 0;

  @Input() currentPage: number = 0;

  @Input() totalPages: number = 0;

  @Input() pageSize: number = 7;

  @Input() inhabilitadosMode: boolean = false;

  @Input() isSearchMode: boolean = false;

  @Output() prev = new EventEmitter<void>();

  @Output() next = new EventEmitter<void>();
  
  @Output() delete = new EventEmitter<number>();

  @Output() reactivate = new EventEmitter<number>();

  get canGoPrev(): boolean {
    return this.currentPage > 0;
  }

  get canGoNext(): boolean {
    return this.totalPages > 0 && this.currentPage < this.totalPages - 1;
  }

  onPrev(): void {
    if (!this.canGoPrev) return;
    this.prev.emit();
  }

  onNext(): void {
    if (!this.canGoNext) return;
    this.next.emit();
  }

  onDelete(id: number): void {
    this.delete.emit(id);
  }

  onReactivate(id: number): void {
    this.reactivate.emit(id);
  }

  initials(name: string) {

    if (!name) return '';

    const parts = name.split(' ').filter(Boolean);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return (
      parts[0][0] +
      (parts[1] ? parts[1][0] : '')
    ).toUpperCase();
  }

}
