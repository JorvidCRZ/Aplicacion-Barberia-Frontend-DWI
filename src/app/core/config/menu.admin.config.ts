export const ADMIN_MENU = [
  {
    label: "Resumen",
    icon: "pi pi-chart-bar",
    routerLink: ["resumen"],
    permission: "DASHBOARD_READ_ADMIN"
  },

  {
    label: "Operaciones",
    icon: "pi pi-briefcase",
    items: [

      {
        label: "Reservas",
        icon: "pi pi-calendar",
        permission: "RESERVA_READ_ALL",
        items: [

          {
            label: "Todas las Reservas",
            icon: "pi pi-globe",
            routerLink: ["operaciones/reservas"],
            permission: "RESERVA_READ_ALL"
          },

          {
            label: "Calendario",
            icon: "pi pi-calendar",
            routerLink: ["operaciones/reservas/calendario"],
            permission: "RESERVA_READ_ALL"
          },

          {
            label: "Nueva Reserva",
            icon: "pi pi-plus",
            routerLink: ["operaciones/reservas/nueva"],
            permission: "RESERVA_CREATE"
          }
        ]
      },
      {
        label: "Ventas",
        icon: "pi pi-shopping-cart",
        routerLink: ["operaciones/ventas"],
        permission: "VENTA_READ_ALL"
      },

      {
        label: "Pagos",
        icon: "pi pi-credit-card",
        routerLink: ["operaciones/pagos"],
      },

      {
        label: "Reclamos",
        icon: "pi pi-exclamation-circle",
        routerLink: ["operaciones/reclamos"],
      },
    ]
  },

   {
    label: "Sueldos",
    icon: "pi pi-chart-bar",
    routerLink: ["sueldos"],
  },

  {
    label: "Gestión",
    icon: "pi pi-users",
    items: [
      {
        label: "Clientes",
        icon: "pi pi-user",
        routerLink: ["gestion/clientes"],
        permission: "CLIENTE_READ_ALL"
      },
      {
        label: "Barberos",
        icon: "pi pi-crown",
        routerLink: ["gestion/barberos"],
        permission: "BARBERO_READ_ALL"
      },
      {
        label: "Usuarios",
        icon: "pi pi-users",
        routerLink: ["gestion/usuarios"],
        permission: "USUARIO_READ_ALL"
      }
    ]
  },

  {
    label: "Catálogo",
    icon: "pi pi-box",
    items: [
      {
        label: "Categorías",
        icon: "pi pi-tags",
        routerLink: ["catalogo/categorias"],
        permission: "CATEGORIA_READ"
      },
      {
        label: "Servicios",
        icon: "pi pi-sparkles",
        routerLink: ["catalogo/servicios"],
        permission: "SERVICIO_READ"
      },
      {
        label: "Productos",
        icon: "pi pi-shopping-bag",
        routerLink: ["catalogo/productos"],
        permission: "PRODUCTO_READ"
      }
    ]
  },

  {
    label: "Análisis",
    icon: "pi pi-chart-line",
    items: [
      {
        label: "Reportes",
        icon: "pi pi-file",
        routerLink: ["analisis/reportes"],
        permission: "REPORTE_READ_ALL"
      },
      {
        label: "Métricas",
        icon: "pi pi-chart-bar",
        routerLink: ["analisis/metricas"],
        permission: "ESTADISTICA_READ_ALL"
      }
    ]
  },

  {
    label: "Sistema",
    icon: "pi pi-server",
    items: [
      {
        label: "Configuración",
        icon: "pi pi-cog",
        routerLink: ["sistema/configuracion"],
        permission: "CONFIGURACION_READ"
      }
    ]
  }
];