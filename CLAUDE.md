# CLAUDE.md — Agencia Distribuidora del SEDEM

## Descripción del Proyecto

Sistema de la **Agencia Distribuidora del SEDEM**, brazo logístico que recibe productos de las empresas públicas productivas (SEDEM) y los despacha hacia los centros destino. Proyecto educativo DW — UCB.

**Dominio Vercel:** `agencia-distribuidora-sedem.vercel.app`

---

## Stack Técnico

Next.js 16 (App Router, RSC) | shadcn/ui + Tailwind | Supabase | @tanstack/react-table | recharts | Vercel | TypeScript estricto

## Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=<url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
```

---

## Esquema de Base de Datos

### Tabla: `agencia_almacenes`
```sql
CREATE TABLE agencia_almacenes (
  almacen_id    INTEGER,
  nombre        TEXT,
  municipio     TEXT,
  departamento  TEXT,
  direccion     TEXT,
  capacidad_m3  INTEGER,
  estado        TEXT
);
```

### Tabla: `agencia_transportistas`
```sql
CREATE TABLE agencia_transportistas (
  transportista_id INTEGER,
  razon_social     TEXT,
  nit              TEXT,
  municipio        TEXT,
  contacto         TEXT,
  telefono         TEXT,
  estado           TEXT
);
```

### Tabla: `agencia_vehiculos`
```sql
CREATE TABLE agencia_vehiculos (
  vehiculo_id      INTEGER,
  transportista_id INTEGER,
  descripcion      TEXT,
  placa            TEXT,
  tipo             TEXT,
  capacidad_kg     INTEGER,
  estado           TEXT
);
```

### Tabla: `agencia_recepciones`
```sql
CREATE TABLE agencia_recepciones (
  recepcion_id        INTEGER,
  nro_lote            TEXT,
  almacen_id          INTEGER,
  transportista_id    INTEGER,
  vehiculo_id         INTEGER,
  fecha_recepcion     TEXT,
  cantidad_recibida   NUMERIC,
  unidad              TEXT,
  condicion           TEXT,
  estado              TEXT,
  responsable         TEXT,
  nro_guia_remision   TEXT,
  temperatura_llegada NUMERIC
);
```

### Tabla: `agencia_despachos`
```sql
CREATE TABLE agencia_despachos (
  despacho_id         INTEGER,
  recepcion_id        INTEGER,
  nro_lote            TEXT,
  almacen_id          INTEGER,
  transportista_id    INTEGER,
  vehiculo_id         INTEGER,
  fecha_despacho      TEXT,
  cantidad_despachada NUMERIC,
  centro_destino      TEXT,
  estado              TEXT,
  responsable         TEXT,
  nro_guia_despacho   TEXT,
  fecha_llegada       TEXT
);
```

> **Notas de diseño:**
> - `nro_lote` permite trazabilidad con SEDEM.produccion (recepciones y despachos).
> - `despachos.recepcion_id` enlaza el despacho a la recepción de origen.
> - `transportista_id` y `vehiculo_id` registran el transportista/vehículo que ejecutó cada movimiento.
> - `condicion` (Conforme/Observado/Rechazado) en recepciones describe la calidad de llegada.
> - `temperatura_llegada` en recepciones permite monitoreo de cadena de frío.
> - `centro_destino` en despachos es texto libre (centro o establecimiento receptor).

> **DATOS SUCIOS:** Errores intencionales en la base. NO limpiar.

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                          # Dashboard logístico
│   ├── almacenes/page.tsx                # Almacenes
│   ├── transportistas/page.tsx           # Transportistas
│   ├── vehiculos/page.tsx                # Vehículos
│   ├── recepciones/page.tsx              # Recepciones
│   ├── despachos/page.tsx                # Despachos
│   ├── docs/page.tsx
│   └── api/
│       ├── almacenes/route.ts (+download/route.ts)
│       ├── transportistas/route.ts (+download/route.ts)
│       ├── vehiculos/route.ts (+download/route.ts)
│       ├── recepciones/route.ts (+[id]/route.ts +download/route.ts)
│       ├── despachos/route.ts (+[id]/route.ts +download/route.ts)
│       └── schema/route.ts
├── components/ (layout, dashboard, data-table, ui)
├── lib/supabase.ts, utils.ts
└── types/database.ts
```

---

## Páginas

### Dashboard (`/`)
- **Stats cards:** almacenes activos, transportistas activos, vehículos activos, recepciones del mes, despachos del mes, tasa de conformidad, total recibido, total despachado
- **Gráfico barras:** Recepciones vs Despachos por mes (últimos 6)
- **Gráfico pie:** Condición de recepciones (Conforme/Observado/Rechazado)
- **Gráfico barras horizontales:** Top transportistas por movimientos (recepciones + despachos)
- **Gráfico barras:** Estado de despachos
- **Gráfico línea:** Temperatura de llegada (últimas recepciones)
- **Gráfico pie:** Composición de flota por tipo de vehículo
- **Lista:** Almacenes activos por departamento (con capacidad total)
- **Colores:** Rojo ladrillo (#C0392B, #E74C3C, #FADBD8) — logística industrial

### Visores de tablas
- 5 tablas con paginación, filtros y descarga CSV
- Recepciones: badge de color para `condicion` (verde=Conforme, amarillo=Observado, rojo=Rechazado), filtro dropdown
- Despachos: badge de color para `estado`, filtro dropdown
- Vehículos: filtro por tipo
- Búsqueda libre por columna principal en cada tabla

### Documentación (`/docs`)
- 5 tablas documentadas
- Diagrama del flujo: SEDEM → Transportista → Recepción → Almacén → Despacho → Centro destino
- Nota sobre trazabilidad por `nro_lote` y enlace `despachos.recepcion_id`

---

## API Endpoints

| Tabla           | List | By ID | Download |
|-----------------|------|-------|----------|
| almacenes       | ✓    | —     | ✓        |
| transportistas  | ✓    | —     | ✓        |
| vehiculos       | ✓    | —     | ✓        |
| recepciones     | ✓    | ✓     | ✓        |
| despachos       | ✓    | ✓     | ✓        |
| schema          | ✓    | —     | —        |

**Filtros almacenes:** `estado`, `departamento`, `municipio`

**Filtros transportistas:** `estado`, `municipio`, `nit`

**Filtros vehiculos:** `transportista_id`, `tipo`, `estado`, `placa`

**Filtros recepciones:** `almacen_id`, `transportista_id`, `vehiculo_id`, `nro_lote`, `condicion`, `estado`, `fecha_desde`, `fecha_hasta`

**Filtros despachos:** `almacen_id`, `transportista_id`, `vehiculo_id`, `recepcion_id`, `nro_lote`, `centro_destino`, `estado`, `fecha_desde`, `fecha_hasta`

**CORS abierto. Response: `system: "AGENCIA_DISTRIBUIDORA"`.**

---

## Convenciones

- TypeScript estricto, shadcn/ui, Server Components por defecto
- CORS abierto, no auth
- Paleta: rojo (#C0392B, #E74C3C, #FADBD8)
