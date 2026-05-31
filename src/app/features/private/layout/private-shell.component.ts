import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@/app/shared/components/sidebar/sidebar.component';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-private-shell',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterOutlet, AvatarModule, ButtonModule],
  template: `
  <div class="relative flex min-h-screen overflow-hidden bg-brand-black">
    @if(sidebarOpen){
      <div class="fixed inset-0 z-30 bg-black/60 md:hidden" (click)="toggleSidebar()"></div>
    }

    <aside class="fixed inset-y-0 left-0 z-40 w-72.5 shrink-0 border-r border-ui-border bg-brand-black transition-transform duration-300 md:hidden"
      [class.-translate-x-full]="!sidebarOpen"
      [class.translate-x-0]="sidebarOpen">
      <app-sidebar class="block h-full" [collapsed]="false"/>
    </aside>

    <aside class="hidden h-screen overflow-hidden border-r border-ui-border transition-all duration-300 md:block"
      [class.w-72.5]="!sidebarCollapsed"
      [class.w-20]="sidebarCollapsed">
      <app-sidebar class="block h-full" [(collapsed)]="sidebarCollapsed"/>
    </aside>

    <div class="flex min-h-screen min-w-0 flex-1 flex-col">
      <div class="flex h-16 items-center justify-between border-b border-ui-border bg-ui-black px-4 md:px-6">
        <div class="flex items-center gap-3">
          <span class="inline-flex md:hidden">
            <button pButton type="button" class="boton-sidebar-toggle"
              (click)="toggleSidebar()" aria-label="Abrir o cerrar menú" icon="pi pi-bars"></button>
          </span>
          <span class="hidden md:inline-flex">
            <button pButton type="button" class="boton-sidebar-toggle"
              (click)="toggleSidebarCollapsed()"
              [attr.aria-label]="sidebarCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'"
              [icon]="sidebarCollapsed ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left'"></button>
          </span>
          <span class="font-semibold text-text-primary">{{ title }}</span>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-sm text-text-secondary mr-3" *ngIf="userFullName">{{ userFullName }}</div>
          <p-avatar icon="pi pi-user" class="mr-2" size="large"></p-avatar>
        </div>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto bg-brand-black p-4 md:p-6">
        <router-outlet></router-outlet>
      </div>
    </div>
  </div>
  `,
})
export class PrivateShellComponent {
  @Input() title = 'Panel';
  @Input() userFullName?: string;
  @Input() showVerticalLine = false;

  sidebarOpen = false;
  sidebarCollapsed = false;

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }
  toggleSidebarCollapsed() { this.sidebarCollapsed = !this.sidebarCollapsed; }
}
