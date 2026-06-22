export interface PlanillaResumen {

    totalPlanilla: number;
    totalComisiones: number;
    sueldoFinalTotal: number;
    ventasPeriodo: number;
    barberosActivos: number;
}

export interface PlanillaBarbero {

    barberoId: number;
    nombreBarbero: string;
    sueldoBase: number;
    cantidadVentas: number;
    totalVentas: number;
    porcentajeComision: number;
    montoComision: number;
    sueldoFinal: number;
}