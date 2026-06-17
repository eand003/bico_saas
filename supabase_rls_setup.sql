-- ============================================================
-- SPRAY PRECISION - Supabase RLS Setup para clientes e maquinas
-- Execute este script no Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Habilitar RLS nas tabelas
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maquinas ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. Policies para a tabela CLIENTES
-- ============================================================

-- Remover policies antigas (se existirem) antes de recriar
DROP POLICY IF EXISTS "Users can view their own clients" ON public.clientes;
DROP POLICY IF EXISTS "Users can insert their own clients" ON public.clientes;
DROP POLICY IF EXISTS "Users can update their own clients" ON public.clientes;
DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clientes;

-- SELECT: cada usuário só vê seus próprios clientes
CREATE POLICY "Users can view their own clients"
  ON public.clientes FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: usuário pode inserir clientes com seu próprio user_id
CREATE POLICY "Users can insert their own clients"
  ON public.clientes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: usuário pode atualizar apenas seus próprios clientes
CREATE POLICY "Users can update their own clients"
  ON public.clientes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: usuário pode deletar apenas seus próprios clientes
CREATE POLICY "Users can delete their own clients"
  ON public.clientes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 3. Policies para a tabela MAQUINAS
-- ============================================================

DROP POLICY IF EXISTS "Users can view their own machines" ON public.maquinas;
DROP POLICY IF EXISTS "Users can insert their own machines" ON public.maquinas;
DROP POLICY IF EXISTS "Users can update their own machines" ON public.maquinas;
DROP POLICY IF EXISTS "Users can delete their own machines" ON public.maquinas;

-- SELECT: cada usuário só vê suas próprias máquinas
CREATE POLICY "Users can view their own machines"
  ON public.maquinas FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: usuário pode inserir máquinas com seu próprio user_id
CREATE POLICY "Users can insert their own machines"
  ON public.maquinas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: usuário pode atualizar apenas suas próprias máquinas
CREATE POLICY "Users can update their own machines"
  ON public.maquinas FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: usuário pode deletar apenas suas próprias máquinas
CREATE POLICY "Users can delete their own machines"
  ON public.maquinas FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 4. Verificação: confirmar que RLS foi ativado
-- ============================================================
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('clientes', 'maquinas') AND schemaname = 'public';

-- Deve retornar rowsecurity = TRUE para ambas as tabelas
