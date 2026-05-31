import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@/app/shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  template: `
  <div class="relative flex min-h-screen overflow-hidden bg-brand-black">

    <aside class="hidden h-screen overflow-hidden border-r border-ui-border transition-all duration-300 md:block"[class.w-72.5]="!sidebarCollapsed"[class.w-20]="sidebarCollapsed">
      <app-sidebar class="block h-full" [(collapsed)]="sidebarCollapsed" />
    </aside>

    <div class="flex min-h-screen min-w-0 flex-1 flex-col">
      <div class="min-h-0 flex-1 overflow-y-auto bg-brand-black p-4 md:p-6">
        <router-outlet></router-outlet>
      </div>
    </div>
  </div>
  `,
})

export class DashboardClienteComponent {
  sidebarCollapsed = false;
}
