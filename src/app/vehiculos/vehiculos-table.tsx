'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table/data-table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Vehiculo } from '@/types/database'
import { useMemo, useState } from 'react'

const columns: ColumnDef<Vehiculo>[] = [
  { accessorKey: 'vehiculo_id', header: 'ID', size: 60 },
  { accessorKey: 'transportista_id', header: 'Transp.' },
  { accessorKey: 'descripcion', header: 'Descripción' },
  { accessorKey: 'placa', header: 'Placa' },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
    cell: ({ getValue }) => {
      const v = getValue<string>()
      return <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">{v}</Badge>
    },
  },
  {
    accessorKey: 'capacidad_kg',
    header: 'Capacidad (kg)',
    cell: ({ getValue }) => {
      const v = getValue<number | null>()
      return v != null ? Number(v).toLocaleString('es') : '—'
    },
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ getValue }) => {
      const v = getValue<string>()
      const active = (v ?? '').toLowerCase() === 'activo'
      return (
        <Badge
          className={
            active
              ? 'bg-green-100 text-green-700 hover:bg-green-100'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
          }
        >
          {v}
        </Badge>
      )
    },
  },
]

export function VehiculosTable({ data }: { data: Vehiculo[] }) {
  const [tipoFilter, setTipoFilter] = useState('todos')

  const tipos = useMemo(() => {
    const set = new Set<string>()
    data.forEach((v) => v.tipo && set.add(v.tipo))
    return Array.from(set).sort()
  }, [data])

  const filtered = tipoFilter === 'todos' ? data : data.filter((v) => v.tipo === tipoFilter)

  const filters = (
    <Select value={tipoFilter} onValueChange={(v) => setTipoFilter(v ?? 'todos')}>
      <SelectTrigger className="h-8 w-40 text-xs">
        <SelectValue placeholder="Tipo" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todos">Todos los tipos</SelectItem>
        {tipos.map((t) => (
          <SelectItem key={t} value={t}>{t}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  return (
    <DataTable
      columns={columns}
      data={filtered}
      downloadUrl="/api/vehiculos/download"
      downloadFilename="vehiculos.csv"
      searchPlaceholder="Buscar por placa o descripción..."
      searchColumn="placa"
      filters={filters}
    />
  )
}
