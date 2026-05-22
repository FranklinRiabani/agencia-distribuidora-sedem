-- ============================================================
-- Agencia Distribuidora del SEDEM — Esquema + Datos Semilla
-- Ejecutar en el SQL Editor de Supabase
-- NOTA: Incluye DATOS SUCIOS intencionales (ver CLAUDE.md). NO limpiar.
-- ============================================================

-- ---------- ESQUEMA ----------

CREATE TABLE IF NOT EXISTS agencia_centros_distribucion (
  centro_id SERIAL PRIMARY KEY,
  codigo_centro TEXT NOT NULL,
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  municipio TEXT NOT NULL,
  departamento TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'Principal',
  estado TEXT NOT NULL DEFAULT 'Activo'
);

CREATE TABLE IF NOT EXISTS agencia_recepciones (
  recepcion_id SERIAL PRIMARY KEY,
  centro_id INTEGER NOT NULL REFERENCES agencia_centros_distribucion(centro_id),
  empresa_id INTEGER NOT NULL,
  producto_id INTEGER NOT NULL,
  fecha_recepcion TEXT NOT NULL,
  cantidad NUMERIC(12,2) NOT NULL,
  lote TEXT NOT NULL,
  fecha_vencimiento TEXT,
  estado TEXT NOT NULL DEFAULT 'Conforme'
);
CREATE INDEX IF NOT EXISTS idx_ag_rec_centro ON agencia_recepciones(centro_id);
CREATE INDEX IF NOT EXISTS idx_ag_rec_empresa ON agencia_recepciones(empresa_id);
CREATE INDEX IF NOT EXISTS idx_ag_rec_lote ON agencia_recepciones(lote);

CREATE TABLE IF NOT EXISTS agencia_despachos (
  despacho_id SERIAL PRIMARY KEY,
  centro_id INTEGER NOT NULL REFERENCES agencia_centros_distribucion(centro_id),
  producto_id INTEGER NOT NULL,
  fecha_despacho TEXT NOT NULL,
  cantidad_despachada NUMERIC(12,2) NOT NULL,
  lote TEXT NOT NULL,
  nro_guia_remision TEXT,
  tipo_destino TEXT NOT NULL,
  establecimiento_id INTEGER,
  ci_beneficiaria TEXT,
  programa_destino TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Despachado'
);
CREATE INDEX IF NOT EXISTS idx_ag_desp_centro ON agencia_despachos(centro_id);
CREATE INDEX IF NOT EXISTS idx_ag_desp_programa ON agencia_despachos(programa_destino);
CREATE INDEX IF NOT EXISTS idx_ag_desp_lote ON agencia_despachos(lote);

-- ---------- DATOS SEMILLA ----------

-- Centros de distribución (10)
INSERT INTO agencia_centros_distribucion
  (codigo_centro, nombre, direccion, municipio, departamento, tipo, estado) VALUES
  ('CD-LP-01', 'Centro Distribución La Paz',        'Av. Montes 450',            'La Paz',      'La Paz',      'Principal',  'Activo'),
  ('CD-CB-01', 'Centro Distribución Cochabamba',    'Av. Blanco Galindo Km 4',   'Cochabamba',  'Cochabamba',  'Principal',  'Activo'),
  ('CD-SC-01', 'Centro Distribución Santa Cruz',    'Av. Cristo Redentor 3er anillo', 'Santa Cruz', 'Santa Cruz', 'Principal', 'Activo'),
  ('CD-OR-01', 'Centro Distribución Oruro',         'Calle Bolívar 120',         'Oruro',       'Oruro',       'Secundario', 'Activo'),
  ('CD-PT-01', 'Centro Distribución Potosí',        'Av. Universitaria s/n',     'Potosí',      'Potosí',      'Secundario', 'Activo'),
  ('CD-CH-01', 'Centro Distribución Sucre',         'Calle Junín 88',            'Sucre',       'Chuquisaca',  'Secundario', 'Activo'),
  ('CD-TJ-01', 'Centro Distribución Tarija',        'Av. La Paz 200',            'Tarija',      'Tarija',      'Secundario', 'Activo'),
  ('CD-BN-01', 'Centro Distribución Trinidad',      'Av. 6 de Agosto 75',        'Trinidad',    'Beni',        'Secundario', 'Inactivo'),
  ('CD-PD-01', 'Centro Distribución Cobija',        'Av. Internacional s/n',     'Cobija',      'Pando',       'Secundario', 'Activo'),
  ('cd-lp-02', 'Centro El Alto',                    'Av. 6 de Marzo',            'El Alto',     'la paz',      'Secundario', 'activo');  -- DATO SUCIO: casing inconsistente

-- Recepciones del SEDEM (10)
INSERT INTO agencia_recepciones
  (centro_id, empresa_id, producto_id, fecha_recepcion, cantidad, lote, fecha_vencimiento, estado) VALUES
  (1,  1, 101, '2026-01-12', 1200.00, 'LOTE-LACT-2601', '2026-12-31', 'Conforme'),
  (1,  2, 205, '2026-01-20',  850.50, 'LOTE-HARI-2602', '2026-10-15', 'Conforme'),
  (2,  1, 101, '2026-02-03', 2000.00, 'LOTE-LACT-2603', '2027-01-31', 'Observado'),
  (3,  3, 310, '2026-02-15', 1500.00, 'LOTE-NUTR-2604', '2026-08-30', 'Conforme'),
  (4,  2, 205, '2026-03-01',  -50.00, 'LOTE-HARI-2605', '2026-09-20', 'Rechazado'),  -- DATO SUCIO: cantidad negativa
  (5,  1, 102, '2026-03-10',  640.00, 'LOTE-LACT-2606', NULL,         'Conforme'),    -- DATO SUCIO: sin fecha de vencimiento
  (6,  4, 420, '2026-03-22',  980.00, 'LOTE-COMP-2607', '2026-07-01', 'conforme'),    -- DATO SUCIO: estado en minúscula
  (7,  3, 310, '2026-04-05', 1100.00, 'LOTE-NUTR-2608', '2025-12-01', 'Conforme'),    -- DATO SUCIO: vencimiento ya pasado
  (2,  2, 205, '2027-04-18',  720.00, 'LOTE-HARI-2609', '2027-02-28', 'Conforme'),    -- DATO SUCIO: fecha de recepción futura
  (3,  1, 101, '2026-04-25', 1350.00, '',               '2026-11-30', 'Observado');   -- DATO SUCIO: lote vacío

-- Despachos a programas SUP / SPL (10)
INSERT INTO agencia_despachos
  (centro_id, producto_id, fecha_despacho, cantidad_despachada, lote, nro_guia_remision, tipo_destino, establecimiento_id, ci_beneficiaria, programa_destino, estado) VALUES
  (1, 101, '2026-01-18',  300.00, 'LOTE-LACT-2601', 'GR-0001', 'establecimiento', 5001, NULL,        'SUP', 'Despachado'),
  (1, 205, '2026-01-25',  200.00, 'LOTE-HARI-2602', 'GR-0002', 'establecimiento', 5002, NULL,        'SUP', 'Despachado'),
  (2, 101, '2026-02-10',  500.00, 'LOTE-LACT-2603', 'GR-0003', 'establecimiento', 5003, NULL,        'SUP', 'En tránsito'),
  (3, 310, '2026-02-20',  120.00, 'LOTE-NUTR-2604', 'GR-0004', 'directo',          NULL, '7654321',  'SPL', 'Despachado'),
  (5, 102, '2026-03-15',   80.00, 'LOTE-LACT-2606', 'GR-0005', 'directo',          NULL, '8912345',  'SPL', 'Despachado'),
  (6, 420, '2026-03-28',  150.00, 'LOTE-COMP-2607',  NULL,     'establecimiento', 5004, NULL,        'sup', 'Despachado'),  -- DATO SUCIO: programa en minúscula, sin guía
  (7, 310, '2026-04-08',  900.00, 'LOTE-NUTR-2608', 'GR-0007', 'establecimiento', 5005, '4567890',  'SUP', 'Despachado'),  -- DATO SUCIO: SUP con ci_beneficiaria
  (4, 205, '2026-04-12',   60.00, 'LOTE-HARI-2605', 'GR-0008', 'directo',          6006, NULL,        'SPL', 'Despachado'),  -- DATO SUCIO: directo con establecimiento_id
  (3, 101, '2026-04-30', 9999.00, 'LOTE-LACT-XXXX', 'GR-0009', 'establecimiento', 5006, NULL,        'SUP', 'Despachado'),  -- DATO SUCIO: lote inexistente en recepciones
  (2, 205, '2026-05-05',   45.00, 'LOTE-HARI-2609', 'GR-0010', 'directo',          NULL, '12345678', 'SPL', 'Anulado');
