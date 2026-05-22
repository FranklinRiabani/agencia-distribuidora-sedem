'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table/data-table'
import { Badge } from '@/components/ui/badge'
import { Almacen } from '@/types/database'

const columns: ColumnDef<Almacen>[] = [
  { accessorKey: 'almacen_id', header: 'ID', size: 60 },
  { accessorKey: 'nombre', header: 'Nombre' },
  { accessorKey: 'municipio', header: 'Municipio' },
  { accessorKey: 'departamento', header: 'Departamento' },
  { accessorKey: 'direccion', header: 'Dirección' },
  {
    accessorKey: 'capacidad_m3',
    header: 'Capacidad (m³)',
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
      const normalized = (v ?? '').toLowerCase()
      const active = normalized === 'activo'
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

export function AlmacenesTable({ data }: { data: Almacen[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      downloadUrl="/api/almacenes/download"
      downloadFilename="almacenes.csv"
      searchPlaceholder="Buscar por nombre, municipio..."
      searchColumn="nombre"
    />
  )
}
