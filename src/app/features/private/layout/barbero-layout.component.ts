import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@/app/shared/components/sidebar/sidebar.component';

@Component({
    selector: 'app-barbero-layout',
    imports: [SidebarComponent, RouterOutlet],
    template: `
  <div class="min-h-screen bg-brand-black">
    <div class="fixed top-0 left-0 right-0 h-16 bg-ui-black border-b border-ui-border z-30 flex items-center justify-between px-6">
      <div class="flex items-center gap-4">
        <button class="p-2 rounded-md bg-transparent text-brand-gold">
          <i class="pi pi-bars"></i>
        </button>
        <h2 class="text-lg font-semibold text-white">Panel Barbero</h2>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-text-muted">Estado:</span>
        <span class="px-3 py-1 rounded-md bg-green-600 text-white text-sm">Disponible</span>
      </div>
    </div>

    <div class="flex pt-16">
      <app-sidebar class="w-[290px] shrink-0 h-screen border-r border-ui-border bg-brand-black" />
      <div class="flex-1 min-h-screen overflow-y-auto p-6 bg-brand-black">
        <router-outlet></router-outlet>
      </div>
    </div>
  </div>
  `,
})
export class BarberoLayoutComponent {}
