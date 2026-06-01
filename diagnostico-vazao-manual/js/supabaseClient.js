/**
 * Conector Supabase isolado e flexível
 * Permite reutilizar o cliente já existente da aplicação Spray Precision ou configurar chaves dinamicamente.
 */

let supabase = null;

// Tentar obter chaves que possam estar gravadas no localStorage com segurança (evita erros em abas anônimas)
let storedUrl = '';
let storedKey = '';
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    storedUrl = window.localStorage.getItem('spray_supabase_url') || '';
    storedKey = window.localStorage.getItem('spray_supabase_key') || '';
  }
} catch (e) {
  console.warn("localStorage não está acessível para leitura das chaves do Supabase:", e);
}

// Fallback para credenciais oficiais do projeto SaaS (unifica usuários e banco)
if (!storedUrl) {
  storedUrl = 'https://mjouahzglomvvcfpxtuq.supabase.co';
}
if (!storedKey) {
  storedKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qb3VhaHpnbG9tdnZjZnB4dHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MzU3OTIsImV4cCI6MjA5MDIxMTc5Mn0.6SgPDABbRknn42mx1CnM67_P8O3Z7tqIGmQ7tn-M_bo';
}

// Tentar inicializar o cliente
if (typeof window !== 'undefined') {
  // 1. Tentar reutilizar um cliente global já instanciado pela aplicação-mãe
  if (window.supabaseClient) {
    supabase = window.supabaseClient;
  } else if (window.supabase && storedUrl && storedKey) {
    try {
      supabase = window.supabase.createClient(storedUrl, storedKey);
      window.supabaseClient = supabase;
    } catch (e) {
      console.error("Falha ao inicializar Supabase a partir de credenciais:", e);
    }
  }
}

/**
 * Inicializa ou atualiza as chaves do Supabase manualmente (para quando for rodar online)
 */
function configureSupabase(url, key) {
  if (typeof window === 'undefined') return null;
  
  if (!window.supabase) {
    throw new Error("A biblioteca do Supabase CDN não está carregada!");
  }
  
  try {
    supabase = window.supabase.createClient(url, key);
    
    // Gravar no localStorage para persistência de sessões locais (com segurança em modo anônimo)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('spray_supabase_url', url);
        window.localStorage.setItem('spray_supabase_key', key);
      }
    } catch (e) {
      console.warn("localStorage não está acessível para gravação das chaves do Supabase:", e);
    }
    
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
function isSupabaseConnected() {
  return supabase !== null;
}
