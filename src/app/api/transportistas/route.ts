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
  const estado = searchParams.get('estado')
  const municipio = searchParams.get('municipio')
  const nit = searchParams.get('nit')

  let query = supabase.from('agencia_transportistas').select('*')

  if (estado) query = query.eq('estado', estado)
  if (municipio) query = query.eq('municipio', municipio)
  if (nit) query = query.ilike('nit', `%${nit}%`)

  const { data, error } = await query.order('transportista_id')

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
