'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table/data-table'
import { Badge } from '@/components/ui/badge'
import { Transportista } from '@/types/database'

const columns: ColumnDef<Transportista>[] = [
  { accessorKey: 'transportista_id', header: 'ID', size: 60 },
  { accessorKey: 'razon_social', header: 'Razón Social' },
  { accessorKey: 'nit', header: 'NIT' },
  { accessorKey: 'municipio', header: 'Municipio' },
  { accessorKey: 'contacto', header: 'Contacto' },
  { accessorKey: 'telefono', header: 'Teléfono' },
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

export function TransportistasTable({ data }: { data: Transportista[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      downloadUrl="/api/transportistas/download"
      downloadFilename="transportistas.csv"
      searchPlaceholder="Buscar por razón social..."
      searchColumn="razon_social"
    />
  )
}
