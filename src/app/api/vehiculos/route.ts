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
  const transportista_id = searchParams.get('transportista_id')
  const tipo = searchParams.get('tipo')
  const estado = searchParams.get('estado')
  const placa = searchParams.get('placa')

  let query = supabase.from('agencia_vehiculos').select('*')

  if (transportista_id) query = query.eq('transportista_id', transportista_id)
  if (tipo) query = query.eq('tipo', tipo)
  if (estado) query = query.eq('estado', estado)
  if (placa) query = query.ilike('placa', `%${placa}%`)

  const { data, error } = await query.order('vehiculo_id')

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
