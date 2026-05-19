import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-usuario-popover',
  imports: [PopoverModule, PopoverModule, CommonModule],
  templateUrl: './usuario-popover.html'
})
export class UsuarioPopoverComponent {
  @ViewChild('popover') popover!: any;
  @Input() logout!: () => void;
  @Input() usuario: any;
  @Input() sitios: MenuItem[] = [];

  dashboardPrefix = '/dashboard-admin';
}
