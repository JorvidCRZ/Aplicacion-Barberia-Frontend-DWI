import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@/app/shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  template: `
  <div class="relative flex h-screen overflow-hidden bg-brand-black">

    <aside class="hidden h-screen overflow-hidden border-r border-ui-border transition-all duration-300 md:flex md:flex-col flex-shrink-0"
      [class.w-72]="!sidebarCollapsed"
      [class.w-20]="sidebarCollapsed">
      <app-sidebar class="flex flex-col h-full" [(collapsed)]="sidebarCollapsed" />
    </aside>

    <div class="flex min-w-0 flex-1 flex-col h-screen overflow-y-auto bg-brand-black">
      <router-outlet></router-outlet>
    </div>

  </div>
  `,
})
export class DashboardClienteComponent {
  sidebarCollapsed = false;
}