import { ReclamoResumen } from "../operaciones/reclamos-model/reclamo.model";

export interface StatsCard {
    title: string;
    value: number | string;
    icon?: string;
    description?: string;
    accentClass?: string;        
    accentTextClass?: string;    
    iconBgClass?: string;        
}

export interface StatsCardConfig {
    title: string;
    key: keyof ReclamoResumen;
    icon?: string;
    accentClass?: string;
    accentTextClass?: string;
    iconBgClass?: string;
}

export interface StatsMapperConfig<T> {
    title: string;
    getValue: (item: T) => string | number;
    getDescription?: (item: T) => string | undefined;
    icon?: string;
    match?: (item: T) => boolean;
}

export const RECLAMOS_STATS_CONFIG: StatsCardConfig[] = [
    { key: 'abiertos',  title: 'Abiertos',   icon: 'pi pi-exclamation-circle', accentClass: 'bg-brand-gold',  accentTextClass: 'text-brand-gold',  iconBgClass: 'bg-brand-gold/10'  },
    { key: 'enProceso', title: 'En proceso',  icon: 'pi pi-spinner-dotted',    accentClass: 'bg-blue-500',    accentTextClass: 'text-blue-400',    iconBgClass: 'bg-blue-500/10'    },
    { key: 'resueltos', title: 'Resueltos',   icon: 'pi pi-check-circle',       accentClass: 'bg-green-500',   accentTextClass: 'text-green-400',   iconBgClass: 'bg-green-500/10'   },
    { key: 'cerrados',  title: 'Cerrados',    icon: 'pi pi-lock',               accentClass: 'bg-teal-500',    accentTextClass: 'text-teal-400',    iconBgClass: 'bg-teal-500/10'    },
    { key: 'anulados',  title: 'Anulados',    icon: 'pi pi-ban',                accentClass: 'bg-red-500',     accentTextClass: 'text-red-400',     iconBgClass: 'bg-red-500/10'     },
    { key: 'total',     title: 'Total',       icon: 'pi pi-list',               accentClass: 'bg-purple-500',  accentTextClass: 'text-purple-400',  iconBgClass: 'bg-purple-500/10'  },
];