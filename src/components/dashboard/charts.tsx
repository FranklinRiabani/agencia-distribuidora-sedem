'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line,
} from 'recharts'

const RED = '#C0392B'
const RED_LIGHT = '#E74C3C'
const ORANGE = '#E67E22'
const GREEN = '#27AE60'
const YELLOW = '#F39C12'
const GRAY = '#95A5A6'
const BLUE = '#2E86C1'

interface RecepcionVsDespachoData {
  mes: string
  recepciones: number
  despachos: number
}

export function RecepcionVsDespachoChart({ data }: { data: RecepcionVsDespachoData[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="recepciones" name="Recepciones" fill={RED} radius={[3, 3, 0, 0]} />
        <Bar dataKey="despachos" name="Despachos" fill={RED_LIGHT} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

interface CondicionData {
  condicion: string
  count: number
}

const CONDICION_COLORS: Record<string, string> = {
  Conforme: GREEN,
  Observado: YELLOW,
  Rechazado: RED,
}

export function CondicionRecepcionesChart({ data }: { data: CondicionData[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          dataKey="count"
          nameKey="condicion"
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={CONDICION_COLORS[d.condicion] ?? GRAY} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

interface TransportistaData {
  nombre: string
  total: number
}

export function TopTransportistasChart({ data }: { data: TransportistaData[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} />
        <YAxis dataKey="nombre" type="category" tick={{ fontSize: 11 }} width={120} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Bar dataKey="total" name="Movimientos" fill={RED} radius={[0, 3, 3, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

interface EstadoDespachosData {
  estado: string
  count: number
}

const ESTADO_DESPACHO_COLORS: Record<string, string> = {
  Despachado: GREEN,
  'En tránsito': BLUE,
  Entregado: '#16A085',
  Anulado: RED,
}

export function EstadoDespachosChart({ data }: { data: EstadoDespachosData[] }) {
  const formatted = data.map((d) => ({ ...d, fill: ESTADO_DESPACHO_COLORS[d.estado] ?? GRAY }))
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={formatted} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="estado" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Bar dataKey="count" name="Despachos" radius={[3, 3, 0, 0]}>
          {formatted.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

interface TemperaturaData {
  fecha: string
  temperatura: number
}

export function TemperaturaChart({ data }: { data: TemperaturaData[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="fecha" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 11 }} unit="°" />
        <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v) => [`${v}°C`, 'Temperatura']} />
        <Line
          type="monotone"
          dataKey="temperatura"
          stroke={ORANGE}
          strokeWidth={2}
          dot={{ fill: ORANGE, r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

interface TipoVehiculoData {
  tipo: string
  count: number
}

const PIE_COLORS = [RED, RED_LIGHT, ORANGE, BLUE, GREEN, YELLOW, GRAY]

export function TipoVehiculoChart({ data }: { data: TipoVehiculoData[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={85}
          dataKey="count"
          nameKey="tipo"
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
