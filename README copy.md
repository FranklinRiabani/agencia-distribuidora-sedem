# Ecosistema Data Warehouse Bolivia — 6 Sistemas OLTP

## Universidad Católica Boliviana — Materia: Data Warehouse

Este repositorio contiene los **6 proyectos** que conforman el ecosistema de sistemas fuente OLTP para el proyecto integrador de Data Warehouse.

---

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                         SEGIP                                    │
│                  (Identidad maestra)                              │
│               segip-bolivia.vercel.app                           │
└──────────┬──────────┬──────────┬──────────┬─────────────────────┘
           │ci        │ci        │ci        │ci
     ┌─────▼──┐ ┌─────▼──┐ ┌────▼───┐ ┌───▼────────────────────┐
     │  BJA   │ │  SUP   │ │  SPL   │ │ Agencia Distribuidora  │
     │(salud) │ │(nutric)│ │(labor) │ │     (logística)         │
     └────────┘ └────────┘ └────────┘ └───────┬─────────────────┘
                                               │recibe productos
                                         ┌─────▼──────────────┐
                                         │       SEDEM         │
                                         │   (producción)      │
                                         └─────────────────────┘
```

---

## Los 6 Proyectos

| # | Sistema | Dominio Vercel | Tablas | Color | Descripción |
|---|---------|---------------|--------|-------|-------------|
| 1 | **SEGIP** | `segip-bolivia.vercel.app` | 1 | Azul #1B4F72 | Identidad maestra de personas |
| 2 | **BJA** | `bono-juana-azurduy.vercel.app` | 5+1 | Verde #0F6E56 | Incentivos materno-infantil |
| 3 | **SUP** | `subsidio-prenatal-vida.vercel.app` | 5+1 | Violeta #7D3C98 | Paquetes nutricionales |
| 4 | **SPL** | `subsidio-prenatal-lactancia.vercel.app` | 5+3 | Naranja #E67E22 | Subsidio laboral + entregas |
| 5 | **Agencia** | `agencia-distribuidora-sedem.vercel.app` | 3 | Rojo #C0392B | Logística de distribución |
| 6 | **SEDEM** | `sedem-bolivia.vercel.app` | 4 | Verde #1E8449 | Producción + comercialización |

**Total: 27 tablas | ~173,000+ registros | Datos intencionalmente sucios**

---

## Supabase: Una Sola Instancia

Los 6 proyectos comparten **un solo proyecto de Supabase** con tablas prefijadas:

- `segip_*` → Proyecto SEGIP
- `bja_*` → Proyecto BJA
- `sup_*` → Proyecto SUP
- `spl_*` → Proyecto SPL
- `agencia_*` → Proyecto Agencia Distribuidora
- `sedem_*` → Proyecto SEDEM
- `establecimientos_salud` → Tabla compartida (BJA + SUP + Agencia)

Cada proyecto Next.js solo accede a sus propias tablas.

---

## Setup Rápido

### 1. Crear proyecto en Supabase
```bash
# Ir a supabase.com → New Project
# Copiar URL y ANON KEY
```

### 2. Ejecutar el generador de datos
```bash
cd generador/
python generador_datos_dw.py
# Esto genera los CSVs con datos sucios
```

### 3. Cargar datos a Supabase
```bash
# Crear tablas ejecutando los SQL de cada CLAUDE.md
# Importar CSVs vía Supabase Dashboard → Table Editor → Import
```

### 4. Crear y desplegar cada proyecto
```bash
# Para cada proyecto (ejemplo: SEGIP):
cd 01-segip/
npx create-next-app@latest segip-bolivia --typescript --tailwind --eslint --app --src-dir
cd segip-bolivia

# Copiar CLAUDE.md al proyecto
cp ../CLAUDE.md .

# Instalar dependencias
npx shadcn@latest init
npx shadcn@latest add card table button badge sheet dialog tabs input select separator skeleton
npm install @tanstack/react-table @supabase/supabase-js recharts

# Configurar variables de entorno
echo "NEXT_PUBLIC_SUPABASE_URL=tu_url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key" >> .env.local

# Usar Claude Code para construir
claude  # Claude Code lee CLAUDE.md y construye el proyecto

# Desplegar en Vercel
vercel
```

### 5. Repetir para los 6 proyectos

---

## Claves de Cruce (para el DW)

| Clave | Origen | Sistemas que la usan | Problema de calidad |
|-------|--------|---------------------|---------------------|
| `ci` | SEGIP | Todos | Formatos mixtos, guiones, ceros extra |
| `establecimiento_id` | Compartida | BJA, SUP, Agencia | Códigos SNIS inconsistentes |
| `producto_id` | SEDEM | Agencia, SUP, SPL | Catálogos con nombres distintos |
| `nro_lote` | SEDEM | Agencia, SUP, SPL | Códigos ligeramente diferentes |
| fechas | Todos | Todos | DD/MM/YYYY vs YYYY-MM-DD vs MM-DD-YYYY |

---

## Flujo del Estudiante

1. **Descubrir** → Visitar los 6 dashboards web, explorar los datos
2. **Documentar** → Leer la documentación de endpoints en `/docs` de cada sistema
3. **Extraer** → Configurar Azure Data Factory para leer de las APIs REST
4. **Perfilar** → Analizar la calidad de los datos (nulos, duplicados, typos, outliers)
5. **Modelar** → Diseñar el modelo dimensional (dimensiones compartidas + hechos)
6. **Limpiar** → Construir ETL que transforme y limpie los datos
7. **Cargar** → Cargar al Data Warehouse en Azure SQL / Synapse
8. **Analizar** → Crear reportes y dashboards analíticos

---

## Tipos de Suciedad Inyectada

- **Nulos (~12%):** Campos que deberían tener valor pero están vacíos
- **Duplicados (~4%):** Registros repetidos, algunos con variaciones mínimas
- **Typos (~8%):** Errores tipográficos en nombres, municipios, productos
- **Fechas mixtas (~10%):** Formatos inconsistentes de fecha
- **Casing (~15%):** Mayúsculas/minúsculas mezcladas
- **Espacios extra (~7%):** Espacios al inicio, final o dobles
- **Outliers (~3%):** Valores numéricos extremos
- **CIs inconsistentes (~10%):** Carnet con/sin extensión, guiones, ceros
