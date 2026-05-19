import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../core/services/auth/token.service';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarItemsService } from '@/app/core/services/layout/sidebar-items.service';

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe, PanelMenuModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Input() collapsed = false;

  private router = inject(Router);
  private tokenService = inject(TokenService);
  private sidebarItemsService = inject(SidebarItemsService);

  constructor() {
    // initialize permisos from existing token on startup (if any)
    this.tokenService.initPermisos();
  }

  menu$ = this.tokenService.permisos$.pipe(
    map((permisos) => {
      const role = this.tokenService.getPrimaryRole();
      console.debug('[Sidebar] permisos=', permisos, ' role=', role);
      return this.sidebarItemsService.getSidebarItems(permisos, role);
    })
  );

  logout() {
    this.tokenService.clearTokens();
    this.router.navigate(['/'], { replaceUrl: true });
  }
}
