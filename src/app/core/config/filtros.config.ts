import { MetricasFiltro } from "../models/analisis/metrica.model";
import { EstadoReserva, MetodoPago, ReporteFiltro } from "../models/analisis/reporte.model";
import { CategoriaFiltro } from "../models/catalogos/categorias.model";
import { ProductoFiltro } from "../models/catalogos/productos.model";
import { ServicioFiltro } from "../models/catalogos/servicios.model";
import { FilterField } from "../models/common/filtro.model";
import { BOOLEAN_FILTERS, CATEGORIA_OPTIONS, CAUSA_RECLAMO_OPTIONS, ESTADO_RECLAMO_OPTIONS, TIPO_PROBLEMA_OPTIONS, TIPO_RECLAMACION_OPTIONS } from "../models/common/select.option.model";
import { ReclamoFiltro } from "../models/operaciones/reclamos-model/reclamo.filtro.model";
import { VentaFiltro } from "../models/ventas/venta.model";


export const FILTROS_CATEGORIA: FilterField<CategoriaFiltro>[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Buscar categoría' },
    { key: 'tipo', label: 'Tipo', type: 'select', options: CATEGORIA_OPTIONS, placeholder: 'Seleccione tipo' },
    { key: 'padreId', label: 'Categoría padre', type: 'select', placeholder: 'Seleccione categoría' },
    { key: 'estado', label: 'Estado', type: 'select', options: BOOLEAN_FILTERS.activo, placeholder: 'Seleccione estado' },
];

export const FILTROS_PRODUCTO: FilterField<ProductoFiltro>[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Buscar producto' },
    { key: 'idCategoria', label: 'Categoría', type: 'treeselect', placeholder: 'Seleccione categoría', treeSelectionMode: 'single' },
    { key: 'precioMin', label: 'Precio mínimo', type: 'number', placeholder: 'S/ 0', currency: true },
    { key: 'precioMax', label: 'Precio máximo', type: 'number', placeholder: 'S/ 1000', currency: true },
    { key: 'publicado', label: 'Publicación', type: 'select', options: BOOLEAN_FILTERS.publicado, placeholder: 'Seleccione estado' },
    { key: 'estado', label: 'Estado', type: 'select', options: BOOLEAN_FILTERS.activo, placeholder: 'Seleccione estado' },
];

export const FILTROS_SERVICIO: FilterField<ServicioFiltro>[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Buscar servicio' },
    { key: 'categoriaId', label: 'Categoría', type: 'treeselect', placeholder: 'Seleccione categoría', treeSelectionMode: 'single' },
    { key: 'precioMin', label: 'Precio mínimo', type: 'number', placeholder: 'S/ 0', currency: true },
    { key: 'precioMax', label: 'Precio máximo', type: 'number', placeholder: 'S/ 1000' },
    { key: 'publicado', label: 'Publicación', type: 'select', options: BOOLEAN_FILTERS.publicado, placeholder: 'Seleccione estado' },
    { key: 'estado', label: 'Estado', type: 'select', options: BOOLEAN_FILTERS.activo, placeholder: 'Seleccione estado' },
];

export const FILTROS_PRODUCTO_PUBLICO: FilterField<ProductoFiltro>[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Buscar producto' },
    { key: 'idCategoria', label: 'Categoría', type: 'treeselect', placeholder: 'Seleccione categoría', treeSelectionMode: 'single' },
    { key: 'precioMin', label: 'Precio mínimo', type: 'number', placeholder: 'S/ 0', currency: true },
    { key: 'precioMax', label: 'Precio máximo', type: 'number', placeholder: 'S/ 1000', currency: true },
];

export const FILTROS_SERVICIO_PUBLICO: FilterField<ServicioFiltro>[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Buscar servicio' },
    { key: 'categoriaId', label: 'Categoría', type: 'treeselect', placeholder: 'Seleccione categoría', treeSelectionMode: 'single' },
    { key: 'precioMin', label: 'Precio mínimo', type: 'number', placeholder: 'S/ 0', currency: true },
    { key: 'precioMax', label: 'Precio máximo', type: 'number', placeholder: 'S/ 1000' },
];

export const FILTROS_RECLAMO: FilterField<ReclamoFiltro>[] = [
    { key: 'numeroReclamo', label: 'Número de reclamo', type: 'text', placeholder: 'Buscar por número' },
    // aca se tiene que hacer un filtro de texto que busque en el nombre del cliente , con autocompletado
    //{ key: 'nombreCliente', label: 'Nombre del cliente', type: 'text', placeholder: 'Buscar por nombre' },
    { key: 'estado', label: 'Estado del reclamo', type: 'select', options: ESTADO_RECLAMO_OPTIONS, placeholder: 'Seleccione estado' },
    { key: 'tipoProblema', label: 'Tipo de problema', type: 'select', options: TIPO_PROBLEMA_OPTIONS, placeholder: 'Seleccione tipo' },
    { key: 'tipoReclamacion', label: 'Tipo de reclamación', type: 'select', options: TIPO_RECLAMACION_OPTIONS, placeholder: 'Seleccione tipo' },
    { key: 'causaReclamo', label: 'Causa del reclamo', type: 'select', options: CAUSA_RECLAMO_OPTIONS, placeholder: 'Seleccione causa' },
    { key: 'esPublico', label: '¿Es público?', type: 'select', options: BOOLEAN_FILTERS.publico, placeholder: 'Seleccione opción' },
    //{ key: 'numeroDocumentoCliente', label: 'Número de documento del cliente', type: 'text', placeholder: 'Buscar por número de documento' },
    //{ key: 'idResponsable', label: 'ID del responsable', type: 'number', placeholder: 'Buscar por ID' },
    { key: 'fechaInicio', label: 'Fecha de inicio', type: 'date', placeholder: 'Desde' },
    { key: 'fechaFin', label: 'Fecha de fin', type: 'date', placeholder: 'Hasta', endOfDay: true },
]
export const FILTROS_REPORTE: FilterField<ReporteFiltro>[] = [
    { key: 'desde', label: 'Desde', type: 'date', placeholder: 'Fecha inicio' },
    { key: 'hasta', label: 'Hasta', type: 'date', placeholder: 'Fecha fin' },
    { key: 'barberoId', label: 'Barbero', type: 'select', placeholder: 'Seleccione barbero', options: [] },
    { key: 'servicioId', label: 'Servicio', type: 'select', placeholder: 'Seleccione servicio', options: [] },
    { key: 'estado', label: 'Estado', type: 'select', placeholder: 'Seleccione estado', options:
    Object.values(EstadoReserva).map(e => ({ label: e, value: e }))
    },
    { key: 'metodoPago', label: 'Método de pago', type: 'select', placeholder: 'Seleccione método', options:
    Object.values(MetodoPago).map(e => ({ label: e, value: e }))
    },
];
export const FILTROS_METRICAS: FilterField<MetricasFiltro>[] = [
  { key: 'fechaInicio', label: 'Desde', type: 'date', placeholder: 'Fecha inicio' },
  { key: 'fechaFin', label: 'Hasta', type: 'date', placeholder: 'Fecha fin', endOfDay: true }
];


export const FILTROS_VENTA: FilterField<VentaFiltro>[] = [
    { key: 'numeroCorrelativo', label: 'N° de Venta', type: 'text', placeholder: 'Ej. VEN-062026-0001' },
    { key: 'cliente', label: 'Nombre del Cliente', type: 'text', placeholder: 'Buscar por nombre' },
    { key: 'tipoComprobante', label: 'Tipo de Comprobante', type: 'select', options: [
        { label: 'Boleta', value: 'BOLETA' },
        { label: 'Factura', value: 'FACTURA' }
    ], placeholder: 'Todos' },
    { key: 'fechaInicio', label: 'Fecha de inicio', type: 'date', placeholder: 'Desde' },
    { key: 'fechaFin', label: 'Fecha de fin', type: 'date', placeholder: 'Hasta', endOfDay: true }
];
