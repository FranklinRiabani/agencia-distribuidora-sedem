export interface Almacen {
  almacen_id: number
  nombre: string
  municipio: string
  departamento: string
  direccion: string
  capacidad_m3: number
  estado: string
}

export interface Transportista {
  transportista_id: number
  razon_social: string
  nit: string
  municipio: string
  contacto: string
  telefono: string
  estado: string
}

export interface Vehiculo {
  vehiculo_id: number
  transportista_id: number
  descripcion: string
  placa: string
  tipo: string
  capacidad_kg: number
  estado: string
}

export interface Recepcion {
  recepcion_id: number
  nro_lote: string
  almacen_id: number
  transportista_id: number
  vehiculo_id: number
  fecha_recepcion: string
  cantidad_recibida: number
  unidad: string
  condicion: string
  estado: string
  responsable: string
  nro_guia_remision: string
  temperatura_llegada: number
}

export interface Despacho {
  despacho_id: number
  recepcion_id: number
  nro_lote: string
  almacen_id: number
  transportista_id: number
  vehiculo_id: number
  fecha_despacho: string
  cantidad_despachada: number
  centro_destino: string
  estado: string
  responsable: string
  nro_guia_despacho: string
  fecha_llegada: string
}

export interface ApiResponse<T> {
  system: 'AGENCIA_DISTRIBUIDORA'
  data: T
  count?: number
  error?: string
}
