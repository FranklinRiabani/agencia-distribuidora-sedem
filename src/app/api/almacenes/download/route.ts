import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS })
}

export async function GET() {
  const { data, error } = await supabase
    .from('agencia_almacenes')
    .select('*')
    .order('almacen_id')

  if (error) {
    return NextResponse.json(
      { system: 'AGENCIA_DISTRIBUIDORA', error: error.message },
      { status: 500, headers: CORS }
    )
  }

  const headers = ['almacen_id', 'nombre', 'municipio', 'departamento', 'direccion', 'capacidad_m3', 'estado']
  const rows = data.map((r) =>
    headers.map((h) => `"${String((r as Record<string, unknown>)[h] ?? '').replace(/"/g, '""')}"`).join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      ...CORS,
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="almacenes.csv"',
    },
  })
}
