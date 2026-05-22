'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table/data-table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Despacho } from '@/types/database'
import { useMemo, useState } from 'react'

const estadoStyles: Record<string, string> = {
  Despachado: 'bg-green-100 text-green-700 hover:bg-green-100',
  'En tránsito': 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  Entregado: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  Anulado: 'bg-red-100 text-red-700 hover:bg-red-100',
}

const columns: ColumnDef<Despacho>[] = [
  { accessorKey: 'despacho_id', header: 'ID', size: 60 },
  { accessorKey: 'recepcion_id', header: 'Recep.' },
  { accessorKey: 'nro_lote', header: 'Lote' },
  { accessorKey: 'almacen_id', header: 'Almacén' },
  { accessorKey: 'transportista_id', header: 'Transp.' },
  { accessorKey: 'vehiculo_id', header: 'Vehíc.' },
  { accessorKey: 'fecha_despacho', header: 'Fecha Desp.' },
  {
    accessorKey: 'cantidad_despachada',
    header: 'Cantidad',
    cell: ({ getValue }) => {
      const v = getValue<number | null>()
      return v != null ? Number(v).toLocaleString('es') : '—'
    },
  },
  { accessorKey: 'centro_destino', header: 'Destino' },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ getValue }) => {
      const v = getValue<string>()
      return <Badge className={estadoStyles[v] ?? 'bg-gray-100 text-gray-600'}>{v ?? '—'}</Badge>
    },
  },
  { accessorKey: 'responsable', header: 'Responsable' },
  { accessorKey: 'nro_guia_despacho', header: 'Guía' },
  { accessorKey: 'fecha_llegada', header: 'Fecha Llegada' },
]

export function DespachosTable({ data }: { data: Despacho[] }) {
  const [estadoFilter, setEstadoFilter] = useState('todos')

  const estadosUnicos = useMemo(() => {
    const set = new Set<string>()
    data.forEach((d) => d.estado && set.add(d.estado))
    return Array.from(set).sort()
  }, [data])

  const filtered = estadoFilter === 'todos' ? data : data.filter((d) => d.estado === estadoFilter)

  const filters = (
    <Select value={estadoFilter} onValueChange={(v) => setEstadoFilter(v ?? 'todos')}>
      <SelectTrigger className="h-8 w-40 text-xs">
        <SelectValue placeholder="Estado" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todos">Todos los estados</SelectItem>
        {estadosUnicos.map((e) => (
          <SelectItem key={e} value={e}>{e}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  return (
    <DataTable
      columns={columns}
      data={filtered}
      downloadUrl="/api/despachos/download"
      downloadFilename="despachos.csv"
      searchPlaceholder="Buscar por lote o destino..."
      searchColumn="nro_lote"
      filters={filters}
    />
  )
}
