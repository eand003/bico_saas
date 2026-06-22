-- ============================================================
-- SPRAY PRECISION - Advanced Supabase RLS Setup (Cyber Security)
-- Protege todas as tabelas contra acessos não autorizados de usuários bloqueados ou com assinaturas vencidas.
-- Execute este script no Supabase Dashboard > SQL Editor para aplicar a segurança.
-- ============================================================

-- 1. Habilitar RLS em todas as tabelas principais
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maquinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_measurements ENABLE ROW LEVEL SECURITY;

-- 2. Criar função de validação de acesso
-- Esta função analisa o JWT do usuário em tempo real a cada requisição
CREATE OR REPLACE FUNCTION public.check_user_access()
RETURNS boolean AS $$
BEGIN
  -- A. Se for Master Admin (eand003@gmail.com), acesso é irrestrito
  IF (auth.jwt() -> 'user_metadata' ->> 'role') = 'master' THEN
    RETURN TRUE;
  END IF;

  -- B. Se a conta estiver bloqueada temporariamente pelo painel admin
  IF (auth.jwt() -> 'user_metadata' ->> 'is_blocked')::boolean IS TRUE THEN
    RETURN FALSE;
  END IF;

  -- C. Se a assinatura estiver vencida (comparando com a data atual)
  IF (auth.jwt() -> 'user_metadata' ->> 'subscription_end') IS NOT NULL THEN
    IF (auth.jwt() -> 'user_metadata' ->> 'subscription_end')::date < current_date THEN
      RETURN FALSE;
    END IF;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- 3. Policies para a tabela CLIENTES
-- ============================================================
DROP POLICY IF EXISTS "Users can view their own clients" ON public.clientes;
DROP POLICY IF EXISTS "Users can insert their own clients" ON public.clientes;
DROP POLICY IF EXISTS "Users can update their own clients" ON public.clientes;
DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clientes;

CREATE POLICY "Users can view their own clients"
  ON public.clientes FOR SELECT
  USING (auth.uid() = user_id AND public.check_user_access());

CREATE POLICY "Users can insert their own clients"
  ON public.clientes FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.check_user_access());

CREATE POLICY "Users can update their own clients"
  ON public.clientes FOR UPDATE
  USING (auth.uid() = user_id AND public.check_user_access())
  WITH CHECK (auth.uid() = user_id AND public.check_user_access());

CREATE POLICY "Users can delete their own clients"
  ON public.clientes FOR DELETE
  USING (auth.uid() = user_id AND public.check_user_access());

-- ============================================================
-- 4. Policies para a tabela MAQUINAS
-- ============================================================
DROP POLICY IF EXISTS "Users can view their own machines" ON public.maquinas;
DROP POLICY IF EXISTS "Users can insert their own machines" ON public.maquinas;
DROP POLICY IF EXISTS "Users can update their own machines" ON public.maquinas;
DROP POLICY IF EXISTS "Users can delete their own machines" ON public.maquinas;

CREATE POLICY "Users can view their own machines"
  ON public.maquinas FOR SELECT
  USING (auth.uid() = user_id AND public.check_user_access());

CREATE POLICY "Users can insert their own machines"
  ON public.maquinas FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.check_user_access());

CREATE POLICY "Users can update their own machines"
  ON public.maquinas FOR UPDATE
  USING (auth.uid() = user_id AND public.check_user_access())
  WITH CHECK (auth.uid() = user_id AND public.check_user_access());

CREATE POLICY "Users can delete their own machines"
  ON public.maquinas FOR DELETE
  USING (auth.uid() = user_id AND public.check_user_access());

-- ============================================================
-- 5. Policies para a tabela FLOW_INSPECTIONS (Laudos)
-- ============================================================
DROP POLICY IF EXISTS "Users can view own flow inspections" ON public.flow_inspections;
DROP POLICY IF EXISTS "Users can insert own flow inspections" ON public.flow_inspections;
DROP POLICY IF EXISTS "Users can update own flow inspections" ON public.flow_inspections;
DROP POLICY IF EXISTS "Users can delete own flow inspections" ON public.flow_inspections;

CREATE POLICY "Users can view own flow inspections"
  ON public.flow_inspections FOR SELECT
  USING (auth.uid() = owner_id AND public.check_user_access());

CREATE POLICY "Users can insert own flow inspections"
  ON public.flow_inspections FOR INSERT
  WITH CHECK (auth.uid() = owner_id AND public.check_user_access());

CREATE POLICY "Users can update own flow inspections"
  ON public.flow_inspections FOR UPDATE
  USING (auth.uid() = owner_id AND public.check_user_access())
  WITH CHECK (auth.uid() = owner_id AND public.check_user_access());

CREATE POLICY "Users can delete own flow inspections"
  ON public.flow_inspections FOR DELETE
  USING (auth.uid() = owner_id AND public.check_user_access());

-- ============================================================
-- 6. Policies para a tabela FLOW_MEASUREMENTS (Medições dos bicos)
-- ============================================================
DROP POLICY IF EXISTS "Users can view measurements from own inspections" ON public.flow_measurements;
DROP POLICY IF EXISTS "Users can insert measurements from own inspections" ON public.flow_measurements;
DROP POLICY IF EXISTS "Users can update measurements from own inspections" ON public.flow_measurements;
DROP POLICY IF EXISTS "Users can delete measurements from own inspections" ON public.flow_measurements;

CREATE POLICY "Users can view measurements from own inspections"
  ON public.flow_measurements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.flow_inspections i
      WHERE i.id = flow_measurements.inspection_id
      AND i.owner_id = auth.uid()
    )
    AND public.check_user_access()
  );

CREATE POLICY "Users can insert measurements from own inspections"
  ON public.flow_measurements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.flow_inspections i
      WHERE i.id = flow_measurements.inspection_id
      AND i.owner_id = auth.uid()
    )
    AND public.check_user_access()
  );

CREATE POLICY "Users can update measurements from own inspections"
  ON public.flow_measurements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.flow_inspections i
      WHERE i.id = flow_measurements.inspection_id
      AND i.owner_id = auth.uid()
    )
    AND public.check_user_access()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.flow_inspections i
      WHERE i.id = flow_measurements.inspection_id
      AND i.owner_id = auth.uid()
    )
    AND public.check_user_access()
  );

CREATE POLICY "Users can delete measurements from own inspections"
  ON public.flow_measurements FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.flow_inspections i
      WHERE i.id = flow_measurements.inspection_id
      AND i.owner_id = auth.uid()
    )
    AND public.check_user_access()
  );
