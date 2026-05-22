import { NextResponse } from 'next/server'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS })
}

export async function GET() {
  const schema = {
    system: 'AGENCIA_DISTRIBUIDORA',
    tables: {
      agencia_almacenes: {
        description: 'Almacenes logísticos de la agencia distribuidora',
        columns: {
          almacen_id: { type: 'INTEGER', pk: true },
          nombre: { type: 'TEXT' },
          municipio: { type: 'TEXT' },
          departamento: { type: 'TEXT' },
          direccion: { type: 'TEXT' },
          capacidad_m3: { type: 'INTEGER' },
          estado: { type: 'TEXT' },
        },
      },
      agencia_transportistas: {
        description: 'Empresas transportistas contratadas para el traslado de productos',
        columns: {
          transportista_id: { type: 'INTEGER', pk: true },
          razon_social: { type: 'TEXT' },
          nit: { type: 'TEXT' },
          municipio: { type: 'TEXT' },
          contacto: { type: 'TEXT' },
          telefono: { type: 'TEXT' },
          estado: { type: 'TEXT' },
        },
      },
      agencia_vehiculos: {
        description: 'Vehículos asociados a transportistas',
        columns: {
          vehiculo_id: { type: 'INTEGER', pk: true },
          transportista_id: { type: 'INTEGER', fk: 'agencia_transportistas.transportista_id' },
          descripcion: { type: 'TEXT' },
          placa: { type: 'TEXT' },
          tipo: { type: 'TEXT' },
          capacidad_kg: { type: 'INTEGER' },
          estado: { type: 'TEXT' },
        },
      },
      agencia_recepciones: {
        description: 'Recepciones de productos en los almacenes de la agencia',
        columns: {
          recepcion_id: { type: 'INTEGER', pk: true },
          nro_lote: { type: 'TEXT' },
          almacen_id: { type: 'INTEGER', fk: 'agencia_almacenes.almacen_id' },
          transportista_id: { type: 'INTEGER', fk: 'agencia_transportistas.transportista_id' },
          vehiculo_id: { type: 'INTEGER', fk: 'agencia_vehiculos.vehiculo_id' },
          fecha_recepcion: { type: 'TEXT' },
          cantidad_recibida: { type: 'NUMERIC' },
          unidad: { type: 'TEXT' },
          condicion: { type: 'TEXT', values: ['Conforme', 'Observado', 'Rechazado'] },
          estado: { type: 'TEXT' },
          responsable: { type: 'TEXT' },
          nro_guia_remision: { type: 'TEXT' },
          temperatura_llegada: { type: 'NUMERIC' },
        },
      },
      agencia_despachos: {
        description: 'Despachos de productos desde los almacenes hacia centros destino',
        columns: {
          despacho_id: { type: 'INTEGER', pk: true },
          recepcion_id: { type: 'INTEGER', fk: 'agencia_recepciones.recepcion_id' },
          nro_lote: { type: 'TEXT' },
          almacen_id: { type: 'INTEGER', fk: 'agencia_almacenes.almacen_id' },
          transportista_id: { type: 'INTEGER', fk: 'agencia_transportistas.transportista_id' },
          vehiculo_id: { type: 'INTEGER', fk: 'agencia_vehiculos.vehiculo_id' },
          fecha_despacho: { type: 'TEXT' },
          cantidad_despachada: { type: 'NUMERIC' },
          centro_destino: { type: 'TEXT' },
          estado: { type: 'TEXT' },
          responsable: { type: 'TEXT' },
          nro_guia_despacho: { type: 'TEXT' },
          fecha_llegada: { type: 'TEXT' },
        },
      },
    },
    endpoints: {
      'GET /api/almacenes': 'Lista almacenes (filtros: estado, departamento, municipio)',
      'GET /api/almacenes/download': 'Descarga CSV de almacenes',
      'GET /api/transportistas': 'Lista transportistas (filtros: estado, municipio, nit)',
      'GET /api/transportistas/download': 'Descarga CSV de transportistas',
      'GET /api/vehiculos': 'Lista vehículos (filtros: transportista_id, tipo, estado, placa)',
      'GET /api/vehiculos/download': 'Descarga CSV de vehículos',
      'GET /api/recepciones': 'Lista recepciones (filtros: almacen_id, transportista_id, vehiculo_id, nro_lote, condicion, estado, fecha_desde, fecha_hasta)',
      'GET /api/recepciones/[id]': 'Recepción por ID',
      'GET /api/recepciones/download': 'Descarga CSV de recepciones',
      'GET /api/despachos': 'Lista despachos (filtros: almacen_id, transportista_id, vehiculo_id, recepcion_id, nro_lote, centro_destino, estado, fecha_desde, fecha_hasta)',
      'GET /api/despachos/[id]': 'Despacho por ID',
      'GET /api/despachos/download': 'Descarga CSV de despachos',
      'GET /api/schema': 'Este documento',
    },
  }

  return NextResponse.json(schema, { headers: CORS })
}
