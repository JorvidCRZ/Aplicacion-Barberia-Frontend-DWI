import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-table-users',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './table-users.html',
  styleUrl: './table-users.css',
})
export class TableUsers {

  @Input() usuarios: any[] = [];

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

  @Output() createAdmin = new EventEmitter<void>();

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

  onCreateAdmin(): void {
    this.createAdmin.emit();
  }

  private getRoleList(usuario: any): string[] {
    return (usuario?.roles || []).map((rol: any) => (rol?.nombre || rol || '').toString().toUpperCase()).filter(Boolean);
  }

  hasRole(usuario: any, role: string): boolean {
    return this.getRoleList(usuario).includes(role.toUpperCase());
  }

  canDisable(usuario: any): boolean {
    return this.hasRole(usuario, 'BARBERO') || this.hasRole(usuario, 'CLIENTE');
  }

  initials(username: string): string {
    if (!username) return '';
    const parts = username.trim().split(/[\s._-]/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }

  getRoleBadgeClass(rol: string): string {
    const r = (rol || '').toLowerCase();
    if (r.includes('admin')) return 'role-admin';
    if (r.includes('barber') || r.includes('barbero')) return 'role-barbero';
    if (r.includes('recep')) return 'role-recep';
    return 'role-default';
  }
}