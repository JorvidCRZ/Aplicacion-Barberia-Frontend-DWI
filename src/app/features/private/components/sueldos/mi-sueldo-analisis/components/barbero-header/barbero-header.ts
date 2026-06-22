import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ResumenBarbero } from '@core/models/planilla/venta-barbero.model';

@Component({
  selector: 'app-barbero-header',
  imports: [CommonModule],
  templateUrl: './barbero-header.html',
  styleUrl: './barbero-header.css',
})
export class BarberoHeader {
  @Input() resumen!: ResumenBarbero;

  private readonly router = inject(Router);

  volver(): void {
    this.router.navigate(['/dashboard/admin/sueldos']);
  }
}