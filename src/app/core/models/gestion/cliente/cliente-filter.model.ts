export type ClienteFilterMode =
  | 'todos'
  | 'recientes'
  | 'mes'
  | 'anio'
  | 'rango'
  | 'personalizado'
  | 'deshabilitados';

export interface ClienteFilterCriteria {
  mode: ClienteFilterMode;
  year: number | null;
  month: number | null;
  fromDate: string;
  toDate: string;
}
