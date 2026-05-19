import { CanActivateFn } from '@angular/router';
import { permisoGuardGuard } from '../../../core/guards/permiso.guard';
export const PRODUCTOS_ROUTE_ADMIN = [
    {
      path: 'productos',
     loadComponent: () => import('./pages/producto-admin-list/productos-admin-list/productos-admin-list').then(m => m.ProductosAdminList),
    },

    {
     path:'create',
     canActivate : [permisoGuardGuard],
     data: {permission: 'PRODUCTO_CREATE'},
     loadComponent: () => import('./pages/producto-create/producto-admin-create/producto-admin-create').then(m => m.ProductoAdminCreate),
     
    }

]