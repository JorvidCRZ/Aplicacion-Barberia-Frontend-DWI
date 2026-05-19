export const CLIENTE_MENU = [
    {
        label: "Dashboard",
        icon: "pi pi-home",
        routerLink: ["/cliente/dashboard"],
        permission: "CLIENTE_DASHBOARD_READ"
    },

    {
        label: "Reservas",
        icon: "pi pi-calendar",
        items: [
            {
                label: "Agendar Cita",
                icon: "pi pi-plus-circle",
                routerLink: ["/cliente/reservar"],
                permission: "RESERVA_CREATE"
            },
            {
                label: "Mis Reservas",
                icon: "pi pi-clock",
                routerLink: ["/cliente/reservas"],
                permission: "RESERVA_READ_OWN"
            }
        ]
    },

    {
        label: "Historial",
        icon: "pi pi-history",
        routerLink: ["/cliente/historial"],
        permission: "HISTORIAL_READ"
    },

    {
        label: "Fidelización",
        icon: "pi pi-star",
        routerLink: ["/cliente/rewards"],
        permission: "REWARD_READ"
    },

    {
        label: "Perfil",
        icon: "pi pi-user",
        routerLink: ["/cliente/perfil"],
        permission: "PERFIL_UPDATE"
    }
];