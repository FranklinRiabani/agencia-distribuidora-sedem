'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table/data-table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Recepcion } from '@/types/database'
import { useState, useMemo } from 'react'

const condicionStyles: Record<string, string> = {
  Conforme: 'bg-green-100 text-green-700 hover:bg-green-100',
  Observado: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  Rechazado: 'bg-red-100 text-red-700 hover:bg-red-100',
}

const columns: ColumnDef<Recepcion>[] = [
  { accessorKey: 'recepcion_id', header: 'ID', size: 60 },
  { accessorKey: 'nro_lote', header: 'Lote' },
  { accessorKey: 'almacen_id', header: 'Almacén' },
  { accessorKey: 'transportista_id', header: 'Transp.' },
  { accessorKey: 'vehiculo_id', header: 'Vehíc.' },
  { accessorKey: 'fecha_recepcion', header: 'Fecha' },
  {
    accessorKey: 'cantidad_recibida',
    header: 'Cantidad',
    cell: ({ getValue }) => {
      const v = getValue<number | null>()
      return v != null ? Number(v).toLocaleString('es') : '—'
    },
  },
  { accessorKey: 'unidad', header: 'Unidad' },
  {
    accessorKey: 'condicion',
    header: 'Condición',
    cell: ({ getValue }) => {
      const v = getValue<string>()
      return <Badge className={condicionStyles[v] ?? 'bg-gray-100 text-gray-600'}>{v ?? '—'}</Badge>
    },
  },
  { accessorKey: 'estado', header: 'Estado' },
  { accessorKey: 'responsable', header: 'Responsable' },
  { accessorKey: 'nro_guia_remision', header: 'Guía' },
  {
    accessorKey: 'temperatura_llegada',
    header: 'Temp. (°C)',
    cell: ({ getValue }) => {
      const v = getValue<number | null>()
      return v != null ? `${v}°` : '—'
    },
  },
]

export function RecepcionesTable({ data }: { data: Recepcion[] }) {
  const [condicionFilter, setCondicionFilter] = useState('todas')

  const condicionesUnicas = useMemo(() => {
    const set = new Set<string>()
    data.forEach((r) => r.condicion && set.add(r.condicion))
    return Array.from(set).sort()
  }, [data])

  const filtered = condicionFilter === 'todas' ? data : data.filter((r) => r.condicion === condicionFilter)

  const filters = (
    <Select value={condicionFilter} onValueChange={(v) => setCondicionFilter(v ?? 'todas')}>
      <SelectTrigger className="h-8 w-40 text-xs">
        <SelectValue placeholder="Condición" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todas">Todas las condiciones</SelectItem>
        {condicionesUnicas.map((c) => (
          <SelectItem key={c} value={c}>{c}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  return (
    <DataTable
      columns={columns}
      data={filtered}
      downloadUrl="/api/recepciones/download"
      downloadFilename="recepciones.csv"
      searchPlaceholder="Buscar por lote..."
      searchColumn="nro_lote"
      filters={filters}
    />
  )
}
