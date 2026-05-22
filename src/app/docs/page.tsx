import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

const tables = [
  {
    name: 'agencia_almacenes',
    description: 'Almacenes logísticos de la agencia distribuidora',
    columns: [
      { name: 'almacen_id', type: 'INTEGER', pk: true, nullable: false, notes: 'Clave primaria' },
      { name: 'nombre', type: 'TEXT', pk: false, nullable: true, notes: '' },
      { name: 'municipio', type: 'TEXT', pk: false, nullable: true, notes: '' },
      { name: 'departamento', type: 'TEXT', pk: false, nullable: true, notes: '' },
      { name: 'direccion', type: 'TEXT', pk: false, nullable: true, notes: '' },
      { name: 'capacidad_m3', type: 'INTEGER', pk: false, nullable: true, notes: 'Capacidad de almacenamiento en m³' },
      { name: 'estado', type: 'TEXT', pk: false, nullable: true, notes: 'Activo / Inactivo' },
    ],
  },
  {
    name: 'agencia_transportistas',
    description: 'Empresas transportistas contratadas',
    columns: [
      { name: 'transportista_id', type: 'INTEGER', pk: true, nullable: false, notes: 'Clave primaria' },
      { name: 'razon_social', type: 'TEXT', pk: false, nullable: true, notes: '' },
      { name: 'nit', type: 'TEXT', pk: false, nullable: true, notes: '' },
      { name: 'municipio', type: 'TEXT', pk: false, nullable: true, notes: '' },
      { name: 'contacto', type: 'TEXT', pk: false, nullable: true, notes: 'Persona de contacto' },
      { name: 'telefono', type: 'TEXT', pk: false, nullable: true, notes: '' },
      { name: 'estado', type: 'TEXT', pk: false, nullable: true, notes: 'Activo / Inactivo' },
    ],
  },
  {
    name: 'agencia_vehiculos',
    description: 'Vehículos asociados a los transportistas',
    columns: [
      { name: 'vehiculo_id', type: 'INTEGER', pk: true, nullable: false, notes: 'Clave primaria' },
      { name: 'transportista_id', type: 'INTEGER', pk: false, nullable: true, notes: 'FK → agencia_transportistas' },
      { name: 'descripcion', type: 'TEXT', pk: false, nullable: true, notes: '' },
      { name: 'placa', type: 'TEXT', pk: false, nullable: true, notes: '' },
      { name: 'tipo', type: 'TEXT', pk: false, nullable: true, notes: 'Camión / Furgón / Cisterna / etc.' },
      { name: 'capacidad_kg', type: 'INTEGER', pk: false, nullable: true, notes: 'Capacidad de carga en kg' },
      { name: 'estado', type: 'TEXT', pk: false, nullable: true, notes: 'Activo / Mantenimiento / Baja' },
    ],
  },
  {
    name: 'agencia_recepciones',
    description: 'Recepciones de productos en los almacenes',
    columns: [
      { name: 'recepcion_id', type: 'INTEGER', pk: true, nullable: false, notes: 'Clave primaria' },
      { name: 'nro_lote', type: 'TEXT', pk: false, nullable: true, notes: 'Trazabilidad con producción SEDEM' },
      { name: 'almacen_id', type: 'INTEGER', pk: false, nullable: true, notes: 'FK → agencia_almacenes' },
      { name: 'transportista_id', type: 'INTEGER', pk: false, nullable: true, notes: 'FK → agencia_transportistas' },
      { name: 'vehiculo_id', type: 'INTEGER', pk: false, nullable: true, notes: 'FK → agencia_vehiculos' },
      { name: 'fecha_recepcion', type: 'TEXT', pk: false, nullable: true, notes: 'YYYY-MM-DD' },
      { name: 'cantidad_recibida', type: 'NUMERIC', pk: false, nullable: true, notes: '' },
      { name: 'unidad', type: 'TEXT', pk: false, nullable: true, notes: 'kg / cajas / litros / etc.' },
      { name: 'condicion', type: 'TEXT', pk: false, nullable: true, notes: 'Conforme / Observado / Rechazado' },
      { name: 'estado', type: 'TEXT', pk: false, nullable: true, notes: '' },
      { name: 'responsable', type: 'TEXT', pk: false, nullable: true, notes: '' },
      { name: 'nro_guia_remision', type: 'TEXT', pk: false, nullable: true, notes: '' },
      { name: 'temperatura_llegada', type: 'NUMERIC', pk: false, nullable: true, notes: 'Grados Celsius' },
    ],
  },
  {
    name: 'agencia_despachos',
    description: 'Despachos hacia centros destino',
    columns: [
      { name: 'despacho_id', type: 'INTEGER', pk: true, nullable: false, notes: 'Clave primaria' },
      { name: 'recepcion_id', type: 'INTEGER', pk: false, nullable: true, notes: 'FK → agencia_recepciones' },
      { name: 'nro_lote', type: 'TEXT', pk: false, nullable: true, notes: 'Trazabilidad' },
      { name: 'almacen_id', type: 'INTEGER', pk: false, nullable: true, notes: 'FK → agencia_almacenes' },
      { name: 'transportista_id', type: 'INTEGER', pk: false, nullable: true, notes: 'FK → agencia_transportistas' },
      { name: 'vehiculo_id', type: 'INTEGER', pk: false, nullable: true, notes: 'FK → agencia_vehiculos' },
      { name: 'fecha_despacho', type: 'TEXT', pk: false, nullable: true, notes: 'YYYY-MM-DD' },
      { name: 'cantidad_despachada', type: 'NUMERIC', pk: false, nullable: true, notes: '' },
      { name: 'centro_destino', type: 'TEXT', pk: false, nullable: true, notes: 'Centro receptor del despacho' },
      { name: 'estado', type: 'TEXT', pk: false, nullable: true, notes: 'Despachado / En tránsito / Entregado / Anulado' },
      { name: 'responsable', type: 'TEXT', pk: false, nullable: true, notes: '' },
      { name: 'nro_guia_despacho', type: 'TEXT', pk: false, nullable: true, notes: '' },
      { name: 'fecha_llegada', type: 'TEXT', pk: false, nullable: true, notes: 'YYYY-MM-DD' },
    ],
  },
]

const endpoints = [
  { method: 'GET', path: '/api/almacenes', desc: 'Lista almacenes. Filtros: estado, departamento, municipio' },
  { method: 'GET', path: '/api/almacenes/download', desc: 'CSV de almacenes' },
  { method: 'GET', path: '/api/transportistas', desc: 'Lista transportistas. Filtros: estado, municipio, nit' },
  { method: 'GET', path: '/api/transportistas/download', desc: 'CSV de transportistas' },
  { method: 'GET', path: '/api/vehiculos', desc: 'Lista vehículos. Filtros: transportista_id, tipo, estado, placa' },
  { method: 'GET', path: '/api/vehiculos/download', desc: 'CSV de vehículos' },
  { method: 'GET', path: '/api/recepciones', desc: 'Lista recepciones. Filtros: almacen_id, transportista_id, vehiculo_id, nro_lote, condicion, estado, fecha_desde, fecha_hasta' },
  { method: 'GET', path: '/api/recepciones/[id]', desc: 'Recepción por ID' },
  { method: 'GET', path: '/api/recepciones/download', desc: 'CSV de recepciones' },
  { method: 'GET', path: '/api/despachos', desc: 'Lista despachos. Filtros: almacen_id, transportista_id, vehiculo_id, recepcion_id, nro_lote, centro_destino, estado, fecha_desde, fecha_hasta' },
  { method: 'GET', path: '/api/despachos/[id]', desc: 'Despacho por ID' },
  { method: 'GET', path: '/api/despachos/download', desc: 'CSV de despachos' },
  { method: 'GET', path: '/api/schema', desc: 'Esquema completo de la API' },
]

export default function DocsPage() {
  return (
    <div className="flex flex-col h-full">
      <Topbar title="Documentación" subtitle="Esquema, flujo y endpoints del sistema" />
      <main className="flex-1 p-6 space-y-8 overflow-auto">

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Flujo del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <div className="bg-[#FADBD8] border border-[#E74C3C] rounded-lg px-4 py-3 text-center">
                <p className="font-bold text-[#C0392B]">SEDEM</p>
                <p className="text-xs text-gray-500">Empresas productivas</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 shrink-0" />
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-center">
                <p className="font-bold text-blue-700">Transportista</p>
                <p className="text-xs text-gray-500">+ vehículo asignado</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 shrink-0" />
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-center">
                <p className="font-bold text-emerald-700">Recepción</p>
                <p className="text-xs text-gray-500">agencia_recepciones</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 shrink-0" />
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
                <p className="font-bold text-gray-700">Almacén</p>
                <p className="text-xs text-gray-500">agencia_almacenes</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 shrink-0" />
              <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 text-center">
                <p className="font-bold text-purple-700">Despacho</p>
                <p className="text-xs text-gray-500">agencia_despachos</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 shrink-0" />
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-center">
                <p className="font-bold text-orange-700">Centro destino</p>
                <p className="text-xs text-gray-500">campo centro_destino</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-xs text-yellow-800 font-medium">Trazabilidad por nro_lote</p>
              <p className="text-xs text-yellow-700 mt-1">
                El campo <code className="bg-yellow-100 px-1 rounded">nro_lote</code> está presente en recepciones y despachos,
                permitiendo rastrear cada unidad desde su producción en SEDEM hasta su centro de destino final.
                Adicionalmente <code className="bg-yellow-100 px-1 rounded">despachos.recepcion_id</code> referencia
                directamente la recepción de origen.
              </p>
            </div>
          </CardContent>
        </Card>

        {tables.map((table) => (
          <Card key={table.name} className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <CardTitle className="text-sm font-semibold text-gray-700 font-mono">{table.name}</CardTitle>
              </div>
              <p className="text-xs text-gray-500">{table.description}</p>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Columna', 'Tipo', 'Nulo', 'Notas'].map((h) => (
                        <th key={h} className="text-left px-3 py-2 font-semibold text-gray-600 uppercase tracking-wide text-[11px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {table.columns.map((col) => (
                      <tr key={col.name} className="hover:bg-gray-50/50">
                        <td className="px-3 py-2">
                          <span className="font-mono text-gray-900">{col.name}</span>
                          {col.pk && <Badge className="ml-2 text-[10px] bg-[#FADBD8] text-[#C0392B] hover:bg-[#FADBD8]">PK</Badge>}
                        </td>
                        <td className="px-3 py-2 font-mono text-blue-600">{col.type}</td>
                        <td className="px-3 py-2">{col.nullable ? 'Sí' : 'No'}</td>
                        <td className="px-3 py-2 text-gray-500">{col.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">API Endpoints</CardTitle>
            <p className="text-xs text-gray-500">CORS abierto · Response incluye <code className="bg-gray-100 px-1 rounded">system: &quot;AGENCIA_DISTRIBUIDORA&quot;</code></p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {endpoints.map(({ method, path, desc }) => (
                <div key={path} className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 shrink-0 font-mono text-[10px]">{method}</Badge>
                  <code className="text-xs text-gray-800 font-mono shrink-0">{path}</code>
                  <span className="text-xs text-gray-500">{desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-400 pb-4">
          Proyecto educativo · UCB · Data Warehouse · 2026
        </div>
      </main>
    </div>
  )
}
