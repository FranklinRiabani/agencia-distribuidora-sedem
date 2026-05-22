export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  RecepcionVsDespachoChart,
  CondicionRecepcionesChart,
  TopTransportistasChart,
  EstadoDespachosChart,
  TemperaturaChart,
  TipoVehiculoChart,
} from '@/components/dashboard/charts'
import {
  Warehouse,
  PackageCheck,
  Send,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Truck,
  Users,
} from 'lucide-react'

async function getDashboardData() {
  const now = new Date()
  const mesActual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const [
    { count: totalAlmacenes },
    { count: totalTransportistas },
    { count: totalVehiculos },
    { count: recepcionesMes },
    { count: despachosMes },
    { data: recepciones },
    { data: despachos },
    { data: almacenes },
    { data: transportistas },
    { data: vehiculos },
  ] = await Promise.all([
    supabase.from('agencia_almacenes').select('*', { count: 'exact', head: true }).eq('estado', 'Activo'),
    supabase.from('agencia_transportistas').select('*', { count: 'exact', head: true }).eq('estado', 'Activo'),
    supabase.from('agencia_vehiculos').select('*', { count: 'exact', head: true }).eq('estado', 'Activo'),
    supabase.from('agencia_recepciones').select('*', { count: 'exact', head: true }).gte('fecha_recepcion', `${mesActual}-01`),
    supabase.from('agencia_despachos').select('*', { count: 'exact', head: true }).gte('fecha_despacho', `${mesActual}-01`),
    supabase.from('agencia_recepciones').select('cantidad_recibida, fecha_recepcion, condicion, transportista_id, temperatura_llegada'),
    supabase.from('agencia_despachos').select('cantidad_despachada, fecha_despacho, estado, transportista_id, centro_destino'),
    supabase.from('agencia_almacenes').select('departamento, estado, capacidad_m3'),
    supabase.from('agencia_transportistas').select('transportista_id, razon_social'),
    supabase.from('agencia_vehiculos').select('tipo, estado'),
  ])

  const totalRecibida = recepciones?.reduce((s, r) => s + Number(r.cantidad_recibida ?? 0), 0) ?? 0
  const totalDespachada = despachos?.reduce((s, d) => s + Number(d.cantidad_despachada ?? 0), 0) ?? 0

  const conformes = recepciones?.filter((r) => (r.condicion ?? '').toLowerCase() === 'conforme').length ?? 0
  const tasaConformidad = recepciones?.length ? Math.round((conformes / recepciones.length) * 100) : 0

  const meses: Record<string, { recepciones: number; despachos: number; label: string }> = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('es', { month: 'short', year: '2-digit' })
    meses[key] = { recepciones: 0, despachos: 0, label }
  }
  recepciones?.forEach((r) => {
    if (!r.fecha_recepcion) return
    const k = String(r.fecha_recepcion).slice(0, 7)
    if (meses[k]) meses[k].recepciones++
  })
  despachos?.forEach((d) => {
    if (!d.fecha_despacho) return
    const k = String(d.fecha_despacho).slice(0, 7)
    if (meses[k]) meses[k].despachos++
  })
  const recVsDesp = Object.values(meses).map(({ label, recepciones, despachos }) => ({
    mes: label,
    recepciones,
    despachos,
  }))

  const condiciones: Record<string, number> = {}
  recepciones?.forEach((r) => {
    const c = r.condicion ?? '—'
    condiciones[c] = (condiciones[c] ?? 0) + 1
  })
  const condicionData = Object.entries(condiciones).map(([condicion, count]) => ({ condicion, count }))

  const estadosDesp: Record<string, number> = {}
  despachos?.forEach((d) => {
    const e = d.estado ?? '—'
    estadosDesp[e] = (estadosDesp[e] ?? 0) + 1
  })
  const estadoDespachosData = Object.entries(estadosDesp).map(([estado, count]) => ({ estado, count }))

  const transportistasMap: Record<number, string> = {}
  transportistas?.forEach((t) => {
    transportistasMap[t.transportista_id] = t.razon_social
  })
  const movPorTransportista: Record<number, number> = {}
  recepciones?.forEach((r) => {
    if (r.transportista_id != null) movPorTransportista[r.transportista_id] = (movPorTransportista[r.transportista_id] ?? 0) + 1
  })
  despachos?.forEach((d) => {
    if (d.transportista_id != null) movPorTransportista[d.transportista_id] = (movPorTransportista[d.transportista_id] ?? 0) + 1
  })
  const topTransportistas = Object.entries(movPorTransportista)
    .map(([id, total]) => ({
      nombre: transportistasMap[Number(id)] ?? `ID ${id}`,
      total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)

  const temperaturas =
    recepciones
      ?.filter((r) => r.fecha_recepcion && r.temperatura_llegada != null)
      .sort((a, b) => String(a.fecha_recepcion).localeCompare(String(b.fecha_recepcion)))
      .slice(-30)
      .map((r) => ({
        fecha: String(r.fecha_recepcion).slice(5),
        temperatura: Number(r.temperatura_llegada),
      })) ?? []

  const tiposVehiculo: Record<string, number> = {}
  vehiculos?.forEach((v) => {
    if (!v.tipo) return
    tiposVehiculo[v.tipo] = (tiposVehiculo[v.tipo] ?? 0) + 1
  })
  const tipoVehiculoData = Object.entries(tiposVehiculo).map(([tipo, count]) => ({ tipo, count }))

  const deptos: Record<string, number> = {}
  almacenes?.forEach((a) => {
    if ((a.estado ?? '').toLowerCase() === 'activo' && a.departamento) {
      deptos[a.departamento] = (deptos[a.departamento] ?? 0) + 1
    }
  })
  const almacenesPorDepto = Object.entries(deptos).sort((a, b) => b[1] - a[1])

  const capacidadTotal = almacenes?.reduce((s, a) => s + Number(a.capacidad_m3 ?? 0), 0) ?? 0

  return {
    totalAlmacenes: totalAlmacenes ?? 0,
    totalTransportistas: totalTransportistas ?? 0,
    totalVehiculos: totalVehiculos ?? 0,
    recepcionesMes: recepcionesMes ?? 0,
    despachosMes: despachosMes ?? 0,
    totalRecibida,
    totalDespachada,
    tasaConformidad,
    capacidadTotal,
    recVsDesp,
    condicionData,
    estadoDespachosData,
    topTransportistas,
    temperaturas,
    tipoVehiculoData,
    almacenesPorDepto,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  const stats = [
    { label: 'Almacenes Activos', value: data.totalAlmacenes, icon: Warehouse, color: 'text-[#C0392B]' },
    { label: 'Transportistas', value: data.totalTransportistas, icon: Users, color: 'text-blue-600' },
    { label: 'Vehículos Activos', value: data.totalVehiculos, icon: Truck, color: 'text-orange-600' },
    { label: 'Recepciones del Mes', value: data.recepcionesMes, icon: PackageCheck, color: 'text-emerald-600' },
    { label: 'Despachos del Mes', value: data.despachosMes, icon: Send, color: 'text-purple-600' },
    {
      label: 'Tasa Conformidad',
      value: `${data.tasaConformidad}%`,
      icon: CheckCircle2,
      color: 'text-green-600',
    },
    {
      label: 'Total Recibido',
      value: data.totalRecibida.toLocaleString('es'),
      icon: TrendingUp,
      color: 'text-cyan-600',
    },
    {
      label: 'Total Despachado',
      value: data.totalDespachada.toLocaleString('es'),
      icon: TrendingDown,
      color: 'text-rose-600',
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Dashboard Logístico" subtitle="Agencia Distribuidora del SEDEM" />
      <main className="flex-1 p-6 space-y-6 overflow-auto">

        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium leading-tight">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                  </div>
                  <Icon className={`w-5 h-5 mt-0.5 ${color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Recepciones vs Despachos por Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <RecepcionVsDespachoChart data={data.recVsDesp} />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Condición de Recepciones</CardTitle>
            </CardHeader>
            <CardContent>
              <CondicionRecepcionesChart data={data.condicionData} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Top Transportistas (recepciones + despachos)</CardTitle>
            </CardHeader>
            <CardContent>
              <TopTransportistasChart data={data.topTransportistas} />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Estado de Despachos</CardTitle>
            </CardHeader>
            <CardContent>
              <EstadoDespachosChart data={data.estadoDespachosData} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Temperatura de Llegada · últimas {data.temperaturas.length} recepciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.temperaturas.length > 0 ? (
                <TemperaturaChart data={data.temperaturas} />
              ) : (
                <p className="text-sm text-gray-400 py-12 text-center">Sin datos de temperatura.</p>
              )}
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Composición de Flota por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              {data.tipoVehiculoData.length > 0 ? (
                <TipoVehiculoChart data={data.tipoVehiculoData} />
              ) : (
                <p className="text-sm text-gray-400 py-12 text-center">Sin datos de vehículos.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">
              Almacenes Activos por Departamento
              <span className="text-gray-400 font-normal ml-2">
                · Capacidad total: {data.capacidadTotal.toLocaleString('es')} m³
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {data.almacenesPorDepto.map(([depto, count]) => (
                <div key={depto} className="flex items-center gap-2 bg-[#FADBD8] rounded-md px-3 py-2">
                  <Warehouse className="w-4 h-4 text-[#C0392B]" />
                  <span className="text-sm font-medium text-[#C0392B]">{depto}</span>
                  <span className="text-xs bg-[#C0392B] text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {count}
                  </span>
                </div>
              ))}
              {data.almacenesPorDepto.length === 0 && (
                <p className="text-sm text-gray-400">Sin datos de almacenes activos.</p>
              )}
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  )
}
