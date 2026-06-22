import { CategoriaTipo } from "../catalogos/categorias.model";
import { CausaReclamo, EstadoReclamo, SolucionReclamo, TipoProblema, TipoReclamacion } from "../operaciones/reclamos-model/reclamo.enum.model";

export interface SelectOption<T = string | number> {
    label: string;
    value?: T;
    id?: T;
}

// Opciones booleanas genéricas para filtros, se pueden extender o modificar según las necesidades de cada módulo
export function createBooleanOptions(labels: { trueLabel: string; falseLabel: string; }): SelectOption<boolean>[] {
    return [{ label: labels.trueLabel, value: true }, { label: labels.falseLabel, value: false }];
}

export const BOOLEAN_FILTERS = {
    activo: createBooleanOptions({ trueLabel: 'Activo', falseLabel: 'Inactivo' }),
    publicado: createBooleanOptions({ trueLabel: 'Publicado', falseLabel: 'No publicado' }),
    destacado: createBooleanOptions({ trueLabel: 'Destacado', falseLabel: 'No destacado' }),
    mostrarEnMenu: createBooleanOptions({ trueLabel: 'Mostrar en menú', falseLabel: 'No mostrar en menú' }),
    conStock: createBooleanOptions({ trueLabel: 'Con stock', falseLabel: 'Sin stock' }),
    enOferta: createBooleanOptions({ trueLabel: 'En oferta', falseLabel: 'Sin oferta' }),
    publico: createBooleanOptions({ trueLabel: 'Público', falseLabel: 'Interno' }),
} as const;

export const BOOLEAN_OPTIONS = BOOLEAN_FILTERS.activo;

export const CATEGORIA_BOOLEAN_FILTERS = {
    activo: BOOLEAN_FILTERS.activo,
    publicado: BOOLEAN_FILTERS.publicado,
    destacado: BOOLEAN_FILTERS.destacado,
    mostrarEnMenu: BOOLEAN_FILTERS.mostrarEnMenu,
}

export const PRODUCTO_BOOLEAN_FILTERS = {
    activo: BOOLEAN_FILTERS.activo,
    publicado: BOOLEAN_FILTERS.publicado,
    conStock: BOOLEAN_FILTERS.conStock,
    enOferta: BOOLEAN_FILTERS.enOferta,
}

export const RECLAMO_BOOLEAN_FILTERS = {
    publico: BOOLEAN_FILTERS.publico,
}   

//Ejemplo de filtro específico para reclamos, se pueden crear otros para cada módulo o usar genéricos
export const  CATEGORIA_OPTIONS: SelectOption<CategoriaTipo>[] = [
    { value: CategoriaTipo.PRODUCTO, label: 'Producto' },
    { value: CategoriaTipo.SERVICIO, label: 'Servicio' }
];

export const TIPO_RECLAMACION_OPTIONS: SelectOption<TipoReclamacion>[] = [
    { label: 'Queja', value: TipoReclamacion.QUEJA },
    { label: 'Reclamo', value: TipoReclamacion.RECLAMO },
];

export const TIPO_PROBLEMA_OPTIONS: SelectOption<TipoProblema>[] = [
    { label: 'Servicio defectuoso', value: TipoProblema.SERVICIO_DEFECTUOSO },
    { label: 'Corte incorrecto', value: TipoProblema.CORTE_INCORRECTO },
    { label: 'Barbero incorrecto', value: TipoProblema.BARBERO_INCORRECTO },
    { label: 'Atención al cliente', value: TipoProblema.ATENCION_AL_CLIENTE },
    { label: 'Incumplimiento de horario', value: TipoProblema.INCUMPLIMIENTO_HORARIO },
    { label: 'Demora en atención', value: TipoProblema.DEMORA_EN_ATENCION },
    { label: 'Reserva incorrecta', value: TipoProblema.RESERVA_INCORRECTA },
    { label: 'Cobro incorrecto', value: TipoProblema.COBRO_INCORRECTO },
    { label: 'Producto defectuoso', value: TipoProblema.PRODUCTO_DEFECTUOSO },
    { label: 'Producto incorrecto', value: TipoProblema.PRODUCTO_INCORRECTO },
    { label: 'Producto incompleto', value: TipoProblema.PRODUCTO_INCOMPLETO },
    { label: 'Producto no llegó', value: TipoProblema.PRODUCTO_NO_LLEGO },
    { label: 'Demora en entrega', value: TipoProblema.DEMORA_EN_ENTREGA },
    { label: 'Otro', value: TipoProblema.OTRO },
];

export const CAUSA_RECLAMO_OPTIONS: SelectOption<CausaReclamo>[] = [
    { label: 'Incidencia del personal', value: CausaReclamo.INCIDENCIA_DEL_PERSONAL },
    { label: 'Incidencia en reserva', value: CausaReclamo.INCIDENCIA_EN_RESERVA },
    { label: 'Incidencia en cobro', value: CausaReclamo.INCIDENCIA_EN_COBRO },
    { label: 'Mala atención', value: CausaReclamo.MALA_ATENCION },
    { label: 'Incumplimiento de horario', value: CausaReclamo.INCUMPLIMIENTO_DE_HORARIO },
    { label: 'Incidencia en sistema', value: CausaReclamo.INCIDENCIA_EN_SISTEMA },
    { label: 'Falta de stock', value: CausaReclamo.FALTA_DE_STOCK },
    { label: 'Incidencia en empaque', value: CausaReclamo.INCIDENCIA_EN_EMPAQUE },
    { label: 'Incidencia en despacho', value: CausaReclamo.INCIDENCIA_EN_DESPACHO },
    { label: 'Falla del proveedor', value: CausaReclamo.FALLA_DEL_PROVEEDOR },
    { label: 'Otro', value: CausaReclamo.OTRO },
];

export const ESTADO_RECLAMO_OPTIONS: SelectOption<EstadoReclamo>[] = [
    { label: 'Abierto', value: EstadoReclamo.ABIERTO },
    { label: 'En proceso', value: EstadoReclamo.EN_PROCESO },
    { label: 'Resuelto', value: EstadoReclamo.RESUELTO },
    { label: 'Cerrado', value: EstadoReclamo.CERRADO },
    { label: 'Anulado', value: EstadoReclamo.ANULADO },
];

export const SOLUCION_RECLAMO_OPTIONS: SelectOption<SolucionReclamo>[] = [
    { label: 'Reembolso total', value: SolucionReclamo.REEMBOLSO_TOTAL },
    { label: 'Reembolso parcial', value: SolucionReclamo.REEMBOLSO_PARCIAL },
    { label: 'Reenvío de producto', value: SolucionReclamo.REENVIO_PRODUCTO },
    { label: 'Cambio de producto', value: SolucionReclamo.CAMBIO_PRODUCTO },
    { label: 'Nota de crédito', value: SolucionReclamo.NOTA_CREDITO },
    { label: 'Disculpa formal', value: SolucionReclamo.DISCULPA_FORMAL },
    { label: 'Bonificación', value: SolucionReclamo.BONIFICACION },
    { label: 'Sin solución', value: SolucionReclamo.SIN_SOLUCION },
    { label: 'Otro', value: SolucionReclamo.OTRO },
];

export const TIPO_DOCUMENTO_OPTIONS: SelectOption<string>[] = [
    { label: 'DNI', value: 'DNI' },
    { label: 'Carné de Extranjería', value: 'CE' },
    { label: 'Pasaporte', value: 'PASAPORTE' },
    // { label: 'RUC', value: 'RUC' },
];