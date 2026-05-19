export const BARBERO_MENU = [
    {
        label: "Dashboard",
        icon: "pi pi-chart-line",
        routerLink: ["resumen"],
        permission: "DASHBOARD_READ_BARBERO"
    },

    {
        label: "Cortes",
        icon: "pi pi-scissors",
        routerLink: ["cortes"],
        permission: "CORTE_READ_ASSIGNED"
    },

    {
        label: "Reservas",
        icon: "pi pi-calendar",
        routerLink: ["reservas"],
        permission: "RESERVA_READ_ASSIGNED"
    },

    {
        label: "Ventas",
        icon: "pi pi-receipt",
        routerLink: ["ventas"],
        permission: "VENTA_READ_ASSIGNED"
    },

    {
        label: "Perfil",
        icon: "pi pi-user-edit",
        routerLink: ["perfil"]
    }
];