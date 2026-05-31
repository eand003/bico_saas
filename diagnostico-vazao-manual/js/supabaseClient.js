/**
 * Conector Supabase isolado e flexível
 * Permite reutilizar o cliente já existente da aplicação Spray Precision ou configurar chaves dinamicamente.
 */

export let supabase = null;

// Tentar obter chaves que possam estar gravadas no localStorage
const storedUrl = localStorage.getItem('spray_supabase_url') || '';
const storedKey = localStorage.getItem('spray_supabase_key') || '';

// Tentar inicializar o cliente
if (typeof window !== 'undefined') {
  // 1. Tentar reutilizar um cliente global já instanciado pela aplicação-mãe
  if (window.supabaseClient) {
    supabase = window.supabaseClient;
  } else if (window.supabase && storedUrl && storedKey) {
    try {
      supabase = window.supabase.createClient(storedUrl, storedKey);
    } catch (e) {
      console.error("Falha ao inicializar Supabase a partir de credenciais salvas:", e);
    }
  }
}

/**
 * Inicializa ou atualiza as chaves do Supabase manualmente (para quando for rodar online)
 */
export function configureSupabase(url, key) {
  if (typeof window === 'undefined') return null;
  
  if (!window.supabase) {
    throw new Error("A biblioteca do Supabase CDN não está carregada!");
  }
  
  try {
    supabase = window.supabase.createClient(url, key);
    
    // Gravar no localStorage para persistência de sessões locais
    localStorage.setItem('spray_supabase_url', url);
    localStorage.setItem('spray_supabase_key', key);
    
    // Disponibilizar globalmente
    window.supabaseClient = supabase;
    
    return supabase;
  } catch (e) {
    console.error("Erro ao configurar cliente Supabase:", e);
    throw e;
  }
}

/**
 * Verifica se o Supabase está ativado e configurado
 */
export function isSupabaseConnected() {
  return supabase !== null;
}
