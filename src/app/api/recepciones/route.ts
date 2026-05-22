import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const almacen_id = searchParams.get('almacen_id')
  const transportista_id = searchParams.get('transportista_id')
  const vehiculo_id = searchParams.get('vehiculo_id')
  const nro_lote = searchParams.get('nro_lote')
  const condicion = searchParams.get('condicion')
  const estado = searchParams.get('estado')
  const fecha_desde = searchParams.get('fecha_desde')
  const fecha_hasta = searchParams.get('fecha_hasta')

  let query = supabase.from('agencia_recepciones').select('*')

  if (almacen_id) query = query.eq('almacen_id', almacen_id)
  if (transportista_id) query = query.eq('transportista_id', transportista_id)
  if (vehiculo_id) query = query.eq('vehiculo_id', vehiculo_id)
  if (nro_lote) query = query.ilike('nro_lote', `%${nro_lote}%`)
  if (condicion) query = query.eq('condicion', condicion)
  if (estado) query = query.eq('estado', estado)
  if (fecha_desde) query = query.gte('fecha_recepcion', fecha_desde)
  if (fecha_hasta) query = query.lte('fecha_recepcion', fecha_hasta)

  const { data, error } = await query.order('recepcion_id', { ascending: false })

  if (error) {
    return NextResponse.json(
      { system: 'AGENCIA_DISTRIBUIDORA', error: error.message },
      { status: 500, headers: CORS }
    )
  }

  return NextResponse.json(
    { system: 'AGENCIA_DISTRIBUIDORA', data, count: data?.length ?? 0 },
    { headers: CORS }
  )
}
