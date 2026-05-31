export const CLIENTE_MENU = [

    {
        label: "Dashboard",
        icon: "pi pi-home",
        routerLink: ["dashboard"],
        routerLinkActiveOptions: { exact: true },
        permission: "CLIENTE_DASHBOARD_READ"
    },

    {
        label: "Reservas",
        icon: "pi pi-calendar",
        items: [
            {
                label: "Agendar Cita",
                icon: "pi pi-plus-circle",
                routerLink: ["reservar/agendar"],
                permission: "RESERVA_CREATE"
            },
            {
                label: "Mis Reservas",
                icon: "pi pi-clock",    
                routerLink: ["reservas/mis-reservas"],
                permission: "RESERVA_READ_OWN"
            }
        ]
    },

    {
        label: "Historial",
        icon: "pi pi-history",
        routerLink: ["historial"],
        permission: "HISTORIAL_READ"
    },

    {
        label: "Fidelización",
        icon: "pi pi-star",
        routerLink: ["rewards"],
        permission: "REWARD_READ"
    },

    {
        label: "Perfil",
        icon: "pi pi-user",
        routerLink: ["perfil"],
        permission: "PERFIL_UPDATE"
    }
];