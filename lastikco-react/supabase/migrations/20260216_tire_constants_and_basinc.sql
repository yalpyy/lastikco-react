-- Sabitler tablosu (Lastik Marka, Desen, Ölçü)
CREATE TABLE IF NOT EXISTS tire_constants (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('marka', 'desen', 'olcu')),
  value VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (type, value)
);

-- RLS politikaları
ALTER TABLE tire_constants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read tire_constants"
  ON tire_constants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tire_constants"
  ON tire_constants FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tire_constants"
  ON tire_constants FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tire_constants"
  ON tire_constants FOR DELETE
  TO authenticated
  USING (true);

-- Mevcut lastik verilerinden benzersiz değerleri içe aktar
INSERT INTO tire_constants (type, value)
SELECT DISTINCT 'marka', tire_marka
FROM tire_details
WHERE tire_marka IS NOT NULL AND tire_marka != ''
ON CONFLICT (type, value) DO NOTHING;

INSERT INTO tire_constants (type, value)
SELECT DISTINCT 'desen', tire_desen
FROM tire_details
WHERE tire_desen IS NOT NULL AND tire_desen != ''
ON CONFLICT (type, value) DO NOTHING;

INSERT INTO tire_constants (type, value)
SELECT DISTINCT 'olcu', tire_olcu
FROM tire_details
WHERE tire_olcu IS NOT NULL AND tire_olcu != ''
ON CONFLICT (type, value) DO NOTHING;

-- Basınç bilgi tablosu (eğer yoksa)
CREATE TABLE IF NOT EXISTS basinc_bilgi (
  id SERIAL PRIMARY KEY,
  tire_id INTEGER NOT NULL REFERENCES tires(id) ON DELETE CASCADE,
  basinc_value NUMERIC(5,2) NOT NULL,
  basinc_km INTEGER NOT NULL DEFAULT 0,
  basinc_tarih DATE NOT NULL DEFAULT CURRENT_DATE,
  basinc_not TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE basinc_bilgi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read basinc_bilgi"
  ON basinc_bilgi FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert basinc_bilgi"
  ON basinc_bilgi FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update basinc_bilgi"
  ON basinc_bilgi FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete basinc_bilgi"
  ON basinc_bilgi FOR DELETE
  TO authenticated
  USING (true);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_tire_constants_type ON tire_constants(type);
CREATE INDEX IF NOT EXISTS idx_basinc_bilgi_tire_id ON basinc_bilgi(tire_id);
CREATE INDEX IF NOT EXISTS idx_basinc_bilgi_tarih ON basinc_bilgi(basinc_tarih);
