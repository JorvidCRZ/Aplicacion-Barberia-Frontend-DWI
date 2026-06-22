export interface RatiosMolde {
  ratio_largo_ancho?: number | string;
  ratio_frente_mandibula?: number | string;
  ratio_pomulos_mandibula?: number | string;
}

export interface MedicionesPx {
  ancho_pomulos?: number;
  ancho_frente?: number;
  ancho_mandibula?: number;
}

export interface MoldeFacial {
  forma?: string;
  apto?: boolean;
  estado?: string;
  mensaje?: string;
  confianza_pct?: number | string;
  ratios?: RatiosMolde;
  mediciones_px?: MedicionesPx;
}

export interface FeaturesAvanzadas {
  jaw_angle?: number | string;
  jawAngle?: number | string;
  facial_symmetry?: number | string;
  symmetry?: number | string;
  face_roundness?: number | string;
  roundness?: number | string;
  jaw_curvature?: number | string;
  curvature?: number | string;
}

export interface CorteRecomendado {
  id: number;
  nombre: string;
  descripcion: string;
  dificultad: string;
  imagen_url?: string;
  genero_objetivo?: string;
}

export interface AnalisisResponse {
  cliente_id?: number;
  forma_cara: string;
  confianza_pct: string | number;
  subtipo_hibrido?: string;
  molde_facial?: MoldeFacial;
  mediciones_px?: MedicionesPx;
  scores_debug?: Record<string, number>;
  puntos_grafico?: Record<string, { x: number; y: number }>;
  contorno_grafico?: string[];
  cortes_recomendados?: CorteRecomendado[];
  features_avanzadas?: FeaturesAvanzadas;
}

export interface HaircutFeaturesRequestDTO {
  [key: string]: any;
}