import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ADMIN_MENU } from '../../config/menu.admin.config';
import { BARBERO_MENU } from '../../config/menu.barbero.config';
import { CLIENTE_MENU } from '../../config/menu.cliente.confing';

@Injectable({
    providedIn: 'root',
})
export class SidebarItemsService {
    getSidebarItems(permisos: string[], role: string): MenuItem[] {
        const menu = this.getMenuByRole(role);
        return this.filterItems(menu, permisos);
    }

    private getMenuByRole(role: string) {
        switch (role) {
            case 'admin': return ADMIN_MENU;
            case 'barbero': return BARBERO_MENU;
            case 'cliente': return CLIENTE_MENU;
            default: return [];
        }
    }

    private filterItems(items: any[], permisos: string[]): MenuItem[] {
        return items.map((item) => {
            const childItems = item.items ? this.filterItems(item.items, permisos) : undefined;
            const canShow = permisos.length === 0 || !item.permission || permisos.includes(item.permission) || !!childItems?.length;
            if (!canShow) {
                return null;
            }
            const menuItem: MenuItem = { label: item.label, icon: item.icon, routerLink: item.routerLink, };
            if (childItems?.length) {
                menuItem.items = childItems;
            }
            return menuItem;
        }).filter((item): item is MenuItem => item !== null);
    }
}